import { IndianRupee, Shield, Users, Calendar, Award, CheckCircle, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import DonateForm from "@/components/common/DonateForm";

// Enhanced NGOs/causes with trust indicators
const causes = [
  {
    id: "1",
    name: "Water for Life Foundation",
    mission: "Bringing clean and safe drinking water to rural communities across India.",
    logo: "https://placehold.co/120x120/000000/ffffff?text=WFL",
    established: "2010",
    beneficiaries: "50,000+",
    transparency: "95%",
    certification: "ISO 9001:2015",
    impact: "Clean water access provided to 150+ villages",
    category: "Water & Sanitation",
    verified: true,
    featuredProject: "Bore Well Installation - Rajasthan",
    urgency: "high"
  },
  {
    id: "2",
    name: "Bright Future Education",
    mission: "Empowering underprivileged children through quality education and skill development.",
    logo: "https://placehold.co/120x120/000000/ffffff?text=BFE",
    established: "2008",
    beneficiaries: "25,000+",
    transparency: "92%",
    certification: "FCRA Registered",
    impact: "2,500+ children graduated from our programs",
    category: "Education",
    verified: true,
    featuredProject: "Digital Learning Centers",
    urgency: "medium"
  },
  {
    id: "3",
    name: "Health Access Initiative",
    mission: "Ensuring affordable and accessible healthcare services for rural and urban poor.",
    logo: "https://placehold.co/120x120/000000/ffffff?text=HAI",
    established: "2012",
    beneficiaries: "75,000+",
    transparency: "98%",
    certification: "GuideStar Gold Seal",
    impact: "Mobile health clinics serving 200+ locations",
    category: "Healthcare",
    verified: true,
    featuredProject: "Maternal Health Program",
    urgency: "high"
  },
  {
    id: "4",
    name: "Green Planet Alliance",
    mission: "Dedicated to reforestation, climate action, and protecting biodiversity.",
    logo: "https://placehold.co/120x120/000000/ffffff?text=GPA",
    established: "2015",
    beneficiaries: "100,000+",
    transparency: "89%",
    certification: "Carbon Trust Certified",
    impact: "2 million trees planted across 5 states",
    category: "Environment",
    verified: true,
    featuredProject: "Urban Forest Development",
    urgency: "medium"
  },
];

export default function DonationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Trust Banner */}
      <div className="bg-black text-white">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure Donations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Verified Organizations</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>100% Transparent</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4" />
            Trusted by 10,000+ donors
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Make a Lasting
            <span className="text-black block mt-2">Impact Today</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 leading-relaxed">
            Join thousands of changemakers supporting verified organizations that are 
            transforming lives across India. Every rupee is tracked and every impact is measured.
          </p>
          
          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-black">₹2.5Cr+</div>
              <div className="text-gray-600 mt-1">Funds Raised</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black">250,000+</div>
              <div className="text-gray-600 mt-1">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black">50+</div>
              <div className="text-gray-600 mt-1">Verified NGOs</div>
            </div>
          </div>
        </div>

        {/* Causes Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {causes.map((cause) => (
            <CauseCard key={cause.id} cause={cause} />
          ))}
        </div>

        {/* Trust Footer */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Trust Our Platform?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Verified Organizations</h4>
                  <p className="text-gray-600 text-sm mt-1">All NGOs undergo rigorous verification and compliance checks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Full Transparency</h4>
                  <p className="text-gray-600 text-sm mt-1">Track your donation impact with detailed progress reports</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Certified Secure</h4>
                  <p className="text-gray-600 text-sm mt-1">Bank-grade security with SSL encryption for all transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CauseCard({ cause }) {
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <Dialog>
      <Card className="h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Card Header with Enhanced Visual Hierarchy */}
        <CardHeader className="p-0">
          <div className="relative">
            <div className="h-2 bg-black"></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={cause.logo}
                      alt={`${cause.name} logo`}
                      className="h-16 w-16 rounded-xl border-2 border-white shadow-lg object-cover"
                    />
                    {cause.verified && (
                      <div className="absolute -top-1 -right-1 bg-black rounded-full p-1">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl text-gray-900">{cause.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs mb-2">{cause.category}</Badge>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {cause.mission}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={`text-xs px-2 py-1 ${getUrgencyColor(cause.urgency)}`}>
                  {cause.urgency === 'high' ? 'Urgent' : cause.urgency === 'medium' ? 'Active' : 'Ongoing'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-500">Established</span>
              </div>
              <div className="font-semibold text-gray-900">{cause.established}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-500">Beneficiaries</span>
              </div>
              <div className="font-semibold text-gray-900">{cause.beneficiaries}</div>
            </div>
          </div>

          {/* Impact Statement */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Recent Impact</h4>
            <p className="text-gray-800 text-sm">{cause.impact}</p>
          </div>

          {/* Featured Project */}
          <div className="border-l-4 border-black pl-4 mb-4">
            <h4 className="font-semibold text-gray-900 text-sm">Featured Project</h4>
            <p className="text-gray-600 text-sm">{cause.featuredProject}</p>
          </div>

          {/* Transparency & Certification */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Transparency: {cause.transparency}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              <span>{cause.certification}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-white border-t p-4">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              className="border-gray-300 hover:border-gray-400 hover:bg-white"
              onClick={() => alert(`Showing details for ${cause.name}`)}
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <DialogTrigger asChild>
              <Button
                className="rounded-full bg-black hover:bg-yellow-500 text-white px-6 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <IndianRupee className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
            </DialogTrigger>
          </div>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-black" />
            Donate to {cause.name}
          </DialogTitle>
          <DialogDescription className="text-left">
            Your contribution to <strong>"{cause.mission}"</strong> will create lasting impact. 
            You'll receive updates on how your donation is making a difference.
          </DialogDescription>
        </DialogHeader>
        <DonateForm ngoName={cause.name} />
      </DialogContent>
    </Dialog>
  );
}