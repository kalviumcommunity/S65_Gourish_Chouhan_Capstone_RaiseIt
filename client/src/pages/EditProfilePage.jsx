import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { getMe, getUser, updateMe, uploadImage } from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyEducation = { degree: "", institution: "", year: "" };
const emptyWork = { position: "", company: "", year: "" };

export default function EditProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser, updateUser } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const authUserId = authUser?.id || authUser?._id;
  const isOwnProfile = id === "me" || id === "undefined" || authUserId === id;

  useEffect(() => {
    if (!isOwnProfile) {
      navigate(`/profile/${id}`);
      return;
    }

    const profileRequest = id === "me" || id === "undefined" ? getMe() : getUser(id);

    profileRequest
      .then((profile) => {
        setForm({
          name: profile.name || "",
          username: profile.username || "",
          email: profile.email || "",
          avatar: profile.avatar || "",
          coverImage: profile.coverImage || "",
          bio: profile.bio || "",
          address: profile.address || "",
          phone: profile.phone || "",
          education: profile.education?.length ? profile.education : [{ ...emptyEducation }],
          workExperience: profile.workExperience?.length ? profile.workExperience : [{ ...emptyWork }],
        });
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  }, [id, isOwnProfile, navigate]);

  const updateField = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const updateArrayField = (listKey, index, key) => (event) => {
    setForm((current) => ({
      ...current,
      [listKey]: current[listKey].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: event.target.value } : item
      ),
    }));
  };

  const addArrayItem = (listKey, emptyValue) => {
    setForm((current) => ({ ...current, [listKey]: [...current[listKey], { ...emptyValue }] }));
  };

  const removeArrayItem = (listKey, index, emptyValue) => {
    setForm((current) => {
      const next = current[listKey].filter((_, itemIndex) => itemIndex !== index);
      return { ...current, [listKey]: next.length ? next : [{ ...emptyValue }] };
    });
  };

  const handleImageUpload = async (key, file) => {
    if (!file) return;
    try {
      const result = await uploadImage(file);
      setForm((current) => ({ ...current, [key]: result.url }));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updateMe(form);
      updateUser({ ...(authUser || {}), ...updated, id: updated._id || updated.id });
      navigate(`/profile/${updated._id || updated.id}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <div className="py-16 text-center text-muted-foreground">Loading profile...</div>;

  return (
    <main className="container py-8">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to={`/profile/${id}`}><ArrowLeft className="mr-1 h-4 w-4" /> Back to Profile</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Profile</CardTitle>
            <CardDescription>Update your public RaiseIt profile.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="personal">
              <CardContent className="pt-6">
                <TabsList className="mb-8 grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="work">Work</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={form.avatar} alt={form.name} />
                        <AvatarFallback>{form.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <Input type="file" accept="image/*" onChange={(event) => handleImageUpload("avatar", event.target.files?.[0])} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="h-36 overflow-hidden rounded-xl border bg-gray-100">
                      {form.coverImage && <img src={form.coverImage} alt="Cover" className="h-full w-full object-cover" />}
                    </div>
                    <Input type="file" accept="image/*" onChange={(event) => handleImageUpload("coverImage", event.target.files?.[0])} />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Full Name" value={form.name} onChange={updateField("name")} required />
                    <Field label="Username" value={form.username} onChange={updateField("username")} />
                  </div>
                  <Field label="Email" value={form.email} disabled />
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea value={form.bio} onChange={updateField("bio")} className="min-h-28" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Address" value={form.address} onChange={updateField("address")} />
                    <Field label="Phone" value={form.phone} onChange={updateField("phone")} />
                  </div>
                </TabsContent>

                <TabsContent value="education" className="space-y-4">
                  {form.education.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="space-y-4 pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="Degree" value={item.degree} onChange={updateArrayField("education", index, "degree")} />
                          <Field label="Institution" value={item.institution} onChange={updateArrayField("education", index, "institution")} />
                        </div>
                        <Field label="Year" value={item.year} onChange={updateArrayField("education", index, "year")} />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("education", index, emptyEducation)}>
                          <Trash2 className="mr-1 h-4 w-4" /> Remove
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addArrayItem("education", emptyEducation)}>
                    <Plus className="mr-1 h-4 w-4" /> Add Education
                  </Button>
                </TabsContent>

                <TabsContent value="work" className="space-y-4">
                  {form.workExperience.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="space-y-4 pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="Position" value={item.position} onChange={updateArrayField("workExperience", index, "position")} />
                          <Field label="Company" value={item.company} onChange={updateArrayField("workExperience", index, "company")} />
                        </div>
                        <Field label="Year" value={item.year} onChange={updateArrayField("workExperience", index, "year")} />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("workExperience", index, emptyWork)}>
                          <Trash2 className="mr-1 h-4 w-4" /> Remove
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addArrayItem("workExperience", emptyWork)}>
                    <Plus className="mr-1 h-4 w-4" /> Add Work
                  </Button>
                </TabsContent>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild><Link to={`/profile/${id}`}>Cancel</Link></Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
              </CardFooter>
            </Tabs>
          </form>
        </Card>
      </div>
    </main>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  );
}
