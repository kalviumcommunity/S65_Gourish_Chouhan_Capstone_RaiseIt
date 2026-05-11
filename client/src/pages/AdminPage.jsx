import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ShieldCheck, Trash2, EyeOff, RotateCcw, Plus, Pencil } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { createCause, deleteCause, deleteModeratedContent, getAdminReports, getAdminSummary, getCauses, moderateContent, updateCause } from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyCause = { name: "", mission: "", category: "", logo: "", image: "", featuredProject: "", impact: "", urgency: "medium", active: true };

const sections = [
  { key: "concerns", title: "Reported Concerns" },
  { key: "groups", title: "Reported Groups" },
  { key: "discussions", title: "Reported Discussions" },
];

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState({ concerns: [], groups: [], discussions: [] });
  const [causes, setCauses] = useState([]);
  const [causeForm, setCauseForm] = useState(emptyCause);
  const [editingCauseId, setEditingCauseId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdmin = () => {
    setLoading(true);
    Promise.all([getAdminSummary(), getAdminReports(), getCauses({ includeInactive: "true" })])
      .then(([summaryData, reportData, causesData]) => {
        setSummary(summaryData);
        setReports(reportData);
        setCauses(causesData);
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") loadAdmin();
  }, [isAuthenticated, user?.role]);

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  const handleModerate = async (type, id, action) => {
    try {
      await moderateContent(type, id, action);
      loadAdmin();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this content permanently?")) return;
    try {
      await deleteModeratedContent(type, id);
      loadAdmin();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCauseSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingCauseId) await updateCause(editingCauseId, causeForm);
      else await createCause(causeForm);
      setCauseForm(emptyCause);
      setEditingCauseId(null);
      loadAdmin();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditCause = (cause) => {
    setEditingCauseId(cause._id);
    setCauseForm({
      name: cause.name || "",
      mission: cause.mission || "",
      category: cause.category || "",
      logo: cause.logo || "",
      image: cause.image || "",
      featuredProject: cause.featuredProject || "",
      impact: cause.impact || "",
      urgency: cause.urgency || "medium",
      active: cause.active !== false,
    });
  };

  const handleDeleteCause = async (id) => {
    if (!window.confirm("Delete this cause permanently?")) return;
    try {
      await deleteCause(id);
      loadAdmin();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-black p-3 text-white"><ShieldCheck className="h-6 w-6" /></div>
        <div>
          <h1 className="text-3xl font-bold">Admin Moderation</h1>
          <p className="text-muted-foreground">Review reported content and keep RaiseIt safe.</p>
        </div>
      </div>

      {loading && <div className="py-10 text-center text-muted-foreground">Loading admin dashboard...</div>}

      {summary && (
        <div className="mb-8 grid gap-4 md:grid-cols-5">
          <SummaryCard label="Users" value={summary.users} />
          <SummaryCard label="Concerns" value={summary.concerns} />
          <SummaryCard label="Groups" value={summary.groups} />
          <SummaryCard label="Donations" value={summary.donations} />
          <SummaryCard label="Causes" value={summary.causes} />
        </div>
      )}

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Donation Causes</h2>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-4 md:grid-cols-2">
            {!causes.length ? (
              <div className="rounded-xl border bg-white p-6 text-center text-muted-foreground md:col-span-2">No causes have been created.</div>
            ) : causes.map((cause) => (
              <Card key={cause._id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">{cause.name}</CardTitle>
                      <CardDescription>{cause.category}</CardDescription>
                    </div>
                    <Badge variant={cause.active ? "default" : "outline"}>{cause.active ? "Active" : "Inactive"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-3 text-sm text-muted-foreground">{cause.mission}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditCause(cause)}><Pencil className="mr-1 h-4 w-4" /> Edit</Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDeleteCause(cause._id)}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Plus className="h-5 w-5" /> {editingCauseId ? "Edit Cause" : "Add Cause"}</CardTitle>
              <CardDescription>Only active causes appear on the donation page.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCauseSubmit} className="space-y-3">
                <AdminInput label="Name" value={causeForm.name} onChange={(value) => setCauseForm({ ...causeForm, name: value })} required />
                <AdminInput label="Category" value={causeForm.category} onChange={(value) => setCauseForm({ ...causeForm, category: value })} required />
                <AdminInput label="Logo initials" value={causeForm.logo} onChange={(value) => setCauseForm({ ...causeForm, logo: value })} />
                <AdminInput label="Image URL" value={causeForm.image} onChange={(value) => setCauseForm({ ...causeForm, image: value })} />
                <AdminTextarea label="Mission" value={causeForm.mission} onChange={(value) => setCauseForm({ ...causeForm, mission: value })} required />
                <AdminTextarea label="Current need" value={causeForm.impact} onChange={(value) => setCauseForm({ ...causeForm, impact: value })} />
                <AdminInput label="Featured project" value={causeForm.featuredProject} onChange={(value) => setCauseForm({ ...causeForm, featuredProject: value })} />
                <select className="w-full rounded-md border px-3 py-2 text-sm" value={causeForm.urgency} onChange={(event) => setCauseForm({ ...causeForm, urgency: event.target.value })}>
                  <option value="low">Low urgency</option>
                  <option value="medium">Medium urgency</option>
                  <option value="high">High urgency</option>
                </select>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={causeForm.active} onChange={(event) => setCauseForm({ ...causeForm, active: event.target.checked })} /> Active</label>
                <div className="flex gap-2">
                  <Button type="submit">{editingCauseId ? "Save Cause" : "Create Cause"}</Button>
                  {editingCauseId && <Button type="button" variant="outline" onClick={() => { setEditingCauseId(null); setCauseForm(emptyCause); }}>Cancel</Button>}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.key}>
            <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>
            {!reports[section.key]?.length ? (
              <div className="rounded-xl border bg-white p-6 text-center text-muted-foreground">No reports in this section.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {reports[section.key].map((item) => (
                  <ReportCard
                    key={item._id}
                    type={section.key}
                    item={item}
                    onModerate={handleModerate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

function AdminInput({ label, value, onChange, required = false }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input className="w-full rounded-md border px-3 py-2" value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}

function AdminTextarea({ label, value, onChange, required = false }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <textarea className="min-h-20 w-full rounded-md border px-3 py-2" value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}

function SummaryCard({ label, value }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardDescription>{label}</CardDescription></CardHeader>
      <CardContent><div className="text-3xl font-bold">{value}</div></CardContent>
    </Card>
  );
}

function ReportCard({ type, item, onModerate, onDelete }) {
  const title = item.title || item.name;
  const body = item.description || item.content;
  const author = item.user?.name || item.creator?.name || item.author?.name || "Unknown";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>By {author}</CardDescription>
          </div>
          <Badge variant="outline">{item.reports?.length || 0} reports</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">{body}</p>
        <div className="rounded-lg bg-gray-50 p-3 text-sm">
          <div className="font-medium">Latest report</div>
          <div className="mt-1 text-muted-foreground">{item.reports?.at(-1)?.reason || "No reason provided"}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onModerate(type, item._id, "hide")}>
            <EyeOff className="mr-1 h-4 w-4" /> Hide
          </Button>
          <Button size="sm" variant="outline" onClick={() => onModerate(type, item._id, "restore")}>
            <RotateCcw className="mr-1 h-4 w-4" /> Restore
          </Button>
          <Button size="sm" variant="outline" className="text-red-600" onClick={() => onDelete(type, item._id)}>
            <Trash2 className="mr-1 h-4 w-4" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
