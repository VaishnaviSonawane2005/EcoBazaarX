import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

import { Camera, MapPin } from "lucide-react";

const ECO_GREEN = "#58C18B";

export default function EditProfile({ open, onOpenChange }) {
  const { user, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be under 2MB ⚠️");
      return;
    }

    const r = new FileReader();
    r.onloadend = () => setAvatarPreview(r.result);
    r.readAsDataURL(file);
  };

  const handleSave = () => {
    // 👉 Require name ONLY if editing Profile tab
    if (activeTab === "profile" && !formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    const updatedUser = { ...user, ...formData, avatar: avatarPreview };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);

    toast.success("Changes saved successfully 💚");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          animate-popup transition-all duration-300 ease-out
          backdrop-blur-md bg-white/90 shadow-2xl border border-gray-100
          p-0 rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-hidden
        "
      >
        {/* HEADER */}
        <DialogHeader className="px-6 pt-4 pb-2 border-b bg-white">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            <span style={{ color: ECO_GREEN }}>Edit Profile</span>
          </DialogTitle>

          {/* TABS */}
          <div className="mt-3 flex items-center bg-gray-50 rounded-full p-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 text-sm font-medium px-3 py-1.5 rounded-full transition ${
                activeTab === "profile"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`flex-1 text-sm font-medium px-3 py-1.5 rounded-full transition ${
                activeTab === "address"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Address
            </button>
          </div>
        </DialogHeader>

        {/* BODY (profile tab) */}
        <div className="px-6 py-5 bg-gray-50/60 max-h-[55vh] overflow-y-auto">

          {activeTab === "profile" && (
            <div className="animate-slideIn space-y-5">
              
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3 mb-1">
                <div className="relative">
                  <Avatar className="w-20 h-20 ring-4 ring-white shadow-md">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback className="bg-emerald-50 text-emerald-700 font-semibold text-xl">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-1 -right-1 bg-white border border-gray-200 shadow-sm rounded-full p-1.5 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <Camera className="w-4 h-4" style={{ color: ECO_GREEN }} />
                  </label>

                  <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
                </div>
                <p className="text-[11px] text-gray-500">JPG / PNG up to 2MB</p>
              </div>

              {/* Profile fields */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
                <Field label="Full Name">
                  <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name"/>
                </Field>

                <Field label="Phone">
                  <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210"/>
                </Field>

                <Field label="Bio">
                  <Textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us a little about you"/>
                </Field>
              </div>
            </div>
          )}

          {/* BODY (address tab) */}
          {activeTab === "address" && (
            <div className="animate-slideIn space-y-4">
              <div className="font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: ECO_GREEN }} />
                Delivery Address
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
                <Field label="Address">
                  <Input name="address" value={formData.address} onChange={handleChange} placeholder="Street, Area, House No."/>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="City">
                    <Input name="city" value={formData.city} onChange={handleChange}/>
                  </Field>
                  <Field label="Country">
                    <Input name="country" value={formData.country} onChange={handleChange}/>
                  </Field>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 bg-white border-t flex justify-end gap-3">
          <Button
  variant="outline"
  className="rounded-full px-4 text-sm"
  onClick={() => onOpenChange(false)}   // only cancel closes dialog
>
  Cancel
</Button>

          <Button
            style={{ backgroundColor: ECO_GREEN }}
            className="rounded-full px-5 text-sm text-white hover:opacity-90 transition-all active:scale-95"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-gray-700">{label}</Label>
      {children}
    </div>
  );
}
