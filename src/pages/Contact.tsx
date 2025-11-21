import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Video, Mail } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [topic, setTopic] = useState("networth");
  const [channel, setChannel] = useState("phone");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Request sent successfully", {
      description: "Your banker will contact you within 24 hours.",
    });
    setMessage("");
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Contact Your Banker</h1>
        <p className="text-muted-foreground">
          Your dedicated BNP Paribas private banker is here to help you with all your wealth management needs
        </p>
      </div>

      {/* Banker Info */}
      <Card className="p-6 bg-secondary/5">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-2xl font-bold text-secondary">
            MC
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Marie Clement</h3>
            <p className="text-sm text-muted-foreground">Senior Private Banker</p>
            <p className="text-sm text-muted-foreground mt-2">
              Specializing in wealth management for entrepreneurs and founders
            </p>
          </div>
        </div>
      </Card>

      {/* Contact Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "networth", label: "Net Worth Review" },
                { value: "invest", label: "Investment Opportunities" },
                { value: "financing", label: "Financing & Loans" },
                { value: "other", label: "Other" },
              ].map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={topic === option.value ? "default" : "outline"}
                  onClick={() => setTopic(option.value)}
                  className={topic === option.value ? "bg-secondary hover:bg-secondary/90" : ""}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Channel</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "phone", label: "Phone Call", icon: Phone },
                { value: "video", label: "Video Call", icon: Video },
                { value: "message", label: "Secure Message", icon: Mail },
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={channel === option.value ? "default" : "outline"}
                    onClick={() => setChannel(option.value)}
                    className={`flex flex-col items-center gap-2 h-auto py-4 ${
                      channel === option.value ? "bg-secondary hover:bg-secondary/90" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us how we can help you..."
              className="min-h-[150px] resize-none"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" size="lg">
            Send Request
          </Button>
        </form>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <Phone className="h-8 w-8 mx-auto mb-2 text-secondary" />
          <h3 className="font-semibold mb-1">Direct Line</h3>
          <p className="text-sm text-muted-foreground">+33 1 42 98 12 34</p>
        </Card>
        <Card className="p-4 text-center">
          <Mail className="h-8 w-8 mx-auto mb-2 text-secondary" />
          <h3 className="font-semibold mb-1">Email</h3>
          <p className="text-sm text-muted-foreground">marie.clement@bnpparibas.com</p>
        </Card>
        <Card className="p-4 text-center">
          <Video className="h-8 w-8 mx-auto mb-2 text-secondary" />
          <h3 className="font-semibold mb-1">Schedule</h3>
          <p className="text-sm text-muted-foreground">Book a meeting</p>
        </Card>
      </div>
    </div>
  );
}
