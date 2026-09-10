import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../services/api";

function AddStudent() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    admissionNo: "",
    gender: "Male",
    dob: "",
    admissionDate: "",
    status: "Active",
    classOption: "SEO",
    section: "",
    rollNumber: "",
    fatherName: "",
    parentPhone: "",
    studentPhone: "",
    address: "",
    photo: "",
  });

  const neumorphicCard =
    "bg-[#e0e5ec] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] rounded-2xl p-6 border border-white/50";

  const neumorphicInput =
    "bg-[#e0e5ec] shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.7)] rounded-xl px-4 py-3 outline-none text-slate-800 placeholder-slate-400 font-medium border border-transparent w-full text-xs transition-all focus:border-blue-400";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Your login session has expired. Please login again.");
        navigate("/login");
        return;
      }

      /*
       * Backend Student model expects:
       *
       * name
       * admissionNo
       * className
       * section
       * rollNo
       * gender
       * status
       * parentName
       * parentPhone
       * parentWhatsApp
       * dateOfBirth
       * address
       * admissionDate
       * photo
       */

      const fullName = `${formData.firstName} ${formData.lastName}`
        .trim()
        .replace(/\s+/g, " ");

      const studentPayload = {
        name: fullName,

        admissionNo: formData.admissionNo.trim(),

        className: formData.classOption.trim(),

        section: formData.section.trim(),

        rollNo: formData.rollNumber.trim(),

        gender: formData.gender,

        status: formData.status,

        parentName: formData.fatherName.trim(),

        parentPhone: formData.parentPhone.trim(),

        parentWhatsApp: formData.parentPhone.trim(),

        dateOfBirth: formData.dob || undefined,

        address: formData.address.trim(),

        admissionDate: formData.admissionDate || undefined,

        photo: formData.photo.trim(),
      };

      console.log("Creating student...");
      console.log("Student payload:", studentPayload);

      const result = await apiCall("/students", "POST", studentPayload);

      console.log("Create student response:", result);

      if (!result.success) {
        setError(result.message || "Failed to save student profile.");
        return;
      }

      setSuccess("Student profile successfully saved to database!");

      /*
       * Navigate after successful database save.
       */
      setTimeout(() => {
        navigate("/admin/students");
      }, 1000);
    } catch (err) {
      console.error("Error saving student:", err);

      setError(err.message || "Backend server connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#e0e5ec] min-h-screen font-sans text-slate-700 space-y-6">
      {/* Header */}
      <div className="bg-[#e0e5ec] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] p-5 rounded-2xl flex justify-between items-center border border-white/50">
        <div>
          <h1 className="text-lg font-black text-slate-900 tracking-wide">
            Add New Student - LocalPro1
          </h1>

          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Enter student credentials and upload passport photo.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/students")}
          className="px-4 py-2 bg-[#e0e5ec] shadow-[4px_4px_8px_rgb(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.8)] text-slate-700 font-bold text-xs rounded-xl hover:text-blue-600 transition-all"
        >
          ← Back to Students
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-100 border border-rose-200 text-rose-600 rounded-2xl text-xs font-bold text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-2xl text-xs font-bold text-center">
          ✅ {success}
        </div>
      )}

      {/* Form */}
      <div className={neumorphicCard}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_rgb(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] rounded-2xl">
            <div className="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl shadow-inner">
              👤
            </div>

            <div className="flex-1 text-center sm:text-left">
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                Student Photo
              </label>

              <p className="text-[11px] text-slate-400 mb-2">
                Paste an image URL if required.
              </p>

              <input
                type="text"
                name="photo"
                placeholder="Paste image URL or path"
                value={formData.photo}
                onChange={handleChange}
                className={neumorphicInput}
              />
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ali"
                className={neumorphicInput}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Khan"
                className={neumorphicInput}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Admission Number
              </label>

              <input
                type="text"
                name="admissionNo"
                required
                value={formData.admissionNo}
                onChange={handleChange}
                placeholder="ADM-001"
                className={neumorphicInput}
              />
            </div>
          </div>

          {/* Gender / DOB / Admission Date / Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={neumorphicInput}
              >
                <option value="Male">Male</option>

                <option value="Female">Female</option>

                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Date of Birth
              </label>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={neumorphicInput}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Admission Date
              </label>

              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className={neumorphicInput}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={neumorphicInput}
              >
                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Class */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Class Option
              </label>

              <select
                name="classOption"
                value={formData.classOption}
                onChange={handleChange}
                className={neumorphicInput}
              >
                <option value="SEO">SEO</option>

                <option value="WordPress">WordPress</option>

                <option value="Graphic Designing">Graphic Designing</option>

                <option value="Web Development">Web Development</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Section
              </label>

              <input
                type="text"
                name="section"
                required
                value={formData.section}
                onChange={handleChange}
                placeholder="A / Morning"
                className={neumorphicInput}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Roll Number
              </label>

              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="101"
                className={neumorphicInput}
              />
            </div>
          </div>

          {/* Parent */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Father Name
              </label>

              <input
                type="text"
                name="fatherName"
                required
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Muhammad Ahmed"
                className={neumorphicInput}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Parent Phone / WhatsApp
              </label>

              <input
                type="text"
                name="parentPhone"
                required
                value={formData.parentPhone}
                onChange={handleChange}
                placeholder="0300-1234567"
                className={neumorphicInput}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
                Student Phone / WhatsApp
              </label>

              <input
                type="text"
                name="studentPhone"
                value={formData.studentPhone}
                onChange={handleChange}
                placeholder="0300-7654321"
                className={neumorphicInput}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House #123, Street #4, City"
              className={neumorphicInput}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xl shadow-blue-500/30 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Saving Student Profile..."
              : "Save Full Student Profile to Database"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
