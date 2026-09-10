import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall, API_BASE_URL } from "../../services/api";

function StudentList() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

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
  });

  const neumorphicCard =
    "bg-[#e0e5ec] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] rounded-2xl p-6 border border-white/50";

  const neumorphicInset =
    "bg-[#e0e5ec] shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] rounded-xl px-4 py-2.5 border border-white/20 outline-none text-slate-700 font-medium text-xs w-full";

  // =========================================================
  // Reset Form
  // =========================================================

  const resetForm = () => {
    setFormData({
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
    });

    setPhotoFile(null);

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoPreview("");
  };

  // =========================================================
  // Load Students
  // GET /api/students
  // =========================================================

  const loadStudents = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await apiCall(
        "/students?page=1&limit=100",
        "GET"
      );

      console.log(
        "Students GET response:",
        result
      );

      if (!result.success) {
        setErrorMsg(
          result.message ||
            "Failed to load students."
        );
        return;
      }

      const studentList =
        result.data?.data?.students || [];

      setStudents(studentList);

      console.log(
        `${studentList.length} students loaded.`
      );
    } catch (error) {
      console.error(
        "Load students error:",
        error
      );

      setErrorMsg(
        error.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();

    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, []);

  // =========================================================
  // Input Change
  // =========================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // Image Upload
  // Backend expects:
  // multipart/form-data
  // field name = "photo"
  // =========================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    const allowedExtensions =
      /\.(jpg|jpeg|png|webp)$/i;

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.test(file.name)
    ) {
      setErrorMsg(
        "Invalid image. Only JPG, JPEG, PNG and WEBP are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(
        "Image size must be 5 MB or less."
      );

      e.target.value = "";
      return;
    }

    setErrorMsg("");

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(file);
    setPhotoPreview(
      URL.createObjectURL(file)
    );
  };

  // =========================================================
  // Open Add Modal
  // =========================================================

  const handleOpenModal = () => {
    setErrorMsg("");
    setSuccessMsg("");
    resetForm();
    setShowModal(true);
  };

  // =========================================================
  // Close Modal
  // =========================================================

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setErrorMsg("");
    resetForm();
  };

  // =========================================================
  // Add Student
  //
  // POST /api/students
  //
  // Backend route:
  // protect
  // requireAdminOrTeacher
  // uploadStudentPhoto.single("photo")
  // createStudent
  // =========================================================

  const handleAddStudent = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    const fullName =
      `${formData.firstName} ${formData.lastName}`
        .trim()
        .replace(/\s+/g, " ");

    if (!fullName) {
      setErrorMsg(
        "Please enter student name."
      );
      return;
    }

    if (!formData.admissionNo.trim()) {
      setErrorMsg(
        "Please enter admission number."
      );
      return;
    }

    if (!formData.classOption.trim()) {
      setErrorMsg(
        "Please select class."
      );
      return;
    }

    if (!formData.section.trim()) {
      setErrorMsg(
        "Please enter section."
      );
      return;
    }

    if (!formData.fatherName.trim()) {
      setErrorMsg(
        "Please enter father/guardian name."
      );
      return;
    }

    if (!formData.parentPhone.trim()) {
      setErrorMsg(
        "Please enter parent phone / WhatsApp."
      );
      return;
    }

    setSaving(true);

    try {
      /*
       * IMPORTANT:
       * Do NOT send JSON here.
       *
       * The backend route uses Multer:
       * uploadStudentPhoto.single("photo")
       *
       * Therefore the request must be FormData.
       */

      const payload = new FormData();

      payload.append(
        "name",
        fullName
      );

      payload.append(
        "admissionNo",
        formData.admissionNo.trim()
      );

      payload.append(
        "className",
        formData.classOption.trim()
      );

      payload.append(
        "section",
        formData.section.trim()
      );

      if (formData.rollNumber.trim()) {
        payload.append(
          "rollNo",
          formData.rollNumber.trim()
        );
      }

      payload.append(
        "gender",
        formData.gender.toUpperCase()
      );

      payload.append(
        "status",
        formData.status.toUpperCase()
      );

      payload.append(
        "parentName",
        formData.fatherName.trim()
      );

      payload.append(
        "parentPhone",
        formData.parentPhone.trim()
      );

      payload.append(
        "parentWhatsApp",
        formData.parentPhone.trim()
      );

      if (formData.studentPhone.trim()) {
        /*
         * Current backend Student model does not
         * have a studentPhone field, so it is NOT
         * sent to avoid relying on an unsupported field.
         */
      }

      if (formData.address.trim()) {
        payload.append(
          "address",
          formData.address.trim()
        );
      }

      if (formData.dob) {
        payload.append(
          "dateOfBirth",
          formData.dob
        );
      }

      if (formData.admissionDate) {
        payload.append(
          "admissionDate",
          formData.admissionDate
        );
      }

      // THIS IS THE IMPORTANT PART:
      // exact backend field name = "photo"
      if (photoFile) {
        payload.append(
          "photo",
          photoFile
        );
      }

      console.log(
        "Sending student FormData to backend..."
      );

      console.log(
        "Photo selected:",
        photoFile
          ? {
              name: photoFile.name,
              type: photoFile.type,
              size: photoFile.size,
            }
          : "No photo"
      );

      const result = await apiCall(
        "/students",
        "POST",
        payload
      );

      console.log(
        "Student POST response:",
        result
      );

      if (!result.success) {
        setErrorMsg(
          result.message ||
            "Failed to add student."
        );
        return;
      }

      const newStudent =
        result.data?.data?.student;

      if (newStudent) {
        setStudents((prev) => [
          newStudent,
          ...prev,
        ]);
      } else {
        await loadStudents();
      }

      setShowModal(false);

      setSuccessMsg(
        "Student successfully added with photo!"
      );

      resetForm();

      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (error) {
      console.error(
        "Add student error:",
        error
      );

      setErrorMsg(
        error.message ||
          "Unable to connect to backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // Delete Student
  //
  // DELETE /api/students/:id
  // Admin only
  // =========================================================

  const handleDeleteStudent = async (
    student
  ) => {
    if (!student?._id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete student "${student.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setDeletingId(student._id);

    try {
      const result = await apiCall(
        `/students/${student._id}`,
        "DELETE"
      );

      console.log(
        "Delete student response:",
        result
      );

      if (!result.success) {
        setErrorMsg(
          result.message ||
            "Failed to delete student."
        );
        return;
      }

      setStudents((prev) =>
        prev.filter(
          (item) =>
            item._id !== student._id
        )
      );

      setSuccessMsg(
        "Student deleted successfully."
      );

      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (error) {
      console.error(
        "Delete student error:",
        error
      );

      setErrorMsg(
        error.message ||
          "Unable to delete student."
      );
    } finally {
      setDeletingId("");
    }
  };

  // =========================================================
  // Student Photo URL
  // Backend stores:
  // /uploads/students/filename.jpg
  // =========================================================

  const getPhotoUrl = (photo) => {
    if (!photo) {
      return "";
    }

    if (
      photo.startsWith("http://") ||
      photo.startsWith("https://") ||
      photo.startsWith("data:")
    ) {
      return photo;
    }

    return `${API_BASE_URL.replace(
      "/api",
      ""
    )}${photo}`;
  };

  return (
    <div className="p-6 bg-[#e0e5ec] min-h-screen font-sans text-slate-700">

      {/* =====================================================
          Header
      ====================================================== */}

      <div
        className={`${neumorphicCard} mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}
      >
        <div>
          <h1 className="text-sm font-black text-slate-800">
            Students Management
          </h1>

          <p className="text-[11px] text-slate-500 mt-0.5">
            Manage student credentials, profiles and photos.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={loadStudents}
            disabled={loading}
            className="bg-[#e0e5ec] text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs shadow-[4px_4px_8px_rgb(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.7)] active:scale-95 transition disabled:opacity-50"
          >
            ↻ Refresh
          </button>

          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition"
          >
            + Add Student
          </button>

        </div>
      </div>

      {/* =====================================================
          Notifications
      ====================================================== */}

      {successMsg && (
        <div className="mb-6 p-3 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold text-center">
          ✅ {successMsg}
        </div>
      )}

      {errorMsg && !showModal && (
        <div className="mb-6 p-3 bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold text-center">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* =====================================================
          Loading
      ====================================================== */}

      {loading ? (
        <div className={`${neumorphicCard} text-center py-12`}>
          <p className="text-xs font-bold text-slate-500 animate-pulse">
            Loading students from database...
          </p>
        </div>
      ) : (
        <div className={neumorphicCard}>

          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Students Directory
              </h3>

              <p className="text-[10px] text-slate-400 mt-1">
                {students.length} student(s) found
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse text-xs">

              <thead>
                <tr className="border-b border-slate-300 text-slate-500 uppercase">

                  <th className="pb-3 pr-4">
                    Photo
                  </th>

                  <th className="pb-3 pr-4">
                    Name
                  </th>

                  <th className="pb-3 pr-4">
                    Admission No
                  </th>

                  <th className="pb-3 pr-4">
                    Father Name
                  </th>

                  <th className="pb-3 pr-4">
                    WhatsApp
                  </th>

                  <th className="pb-3 pr-4">
                    Class
                  </th>

                  <th className="pb-3 pr-4">
                    Section
                  </th>

                  <th className="pb-3 pr-4">
                    Status
                  </th>

                  <th className="pb-3 text-right">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">

                {students.length > 0 ? (
                  students.map((student) => {

                    const photoUrl =
                      getPhotoUrl(
                        student.photo
                      );

                    return (
                      <tr
                        key={student._id}
                        className="hover:bg-white/40 transition"
                      >

                        {/* Photo */}

                        <td className="py-3 pr-4">

                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-300 shadow-inner">

                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={student.name || "Student"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                                👤
                              </div>
                            )}

                          </div>

                        </td>

                        {/* Name */}

                        <td className="py-3 pr-4 font-bold text-slate-800">
                          {student.name || "-"}
                        </td>

                        {/* Admission */}

                        <td className="py-3 pr-4 text-slate-600 font-mono">
                          {student.admissionNo || "-"}
                        </td>

                        {/* Father */}

                        <td className="py-3 pr-4 text-slate-600">
                          {student.parentName || "-"}
                        </td>

                        {/* WhatsApp */}

                        <td className="py-3 pr-4 text-slate-600 font-mono">
                          {student.parentWhatsApp || "-"}
                        </td>

                        {/* Class */}

                        <td className="py-3 pr-4 text-slate-600">
                          {student.className || "-"}
                        </td>

                        {/* Section */}

                        <td className="py-3 pr-4 text-slate-600">
                          {student.section || "-"}
                        </td>

                        {/* Status */}

                        <td className="py-3 pr-4">

                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              student.status ===
                              "ACTIVE"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {student.status ||
                              "-"}
                          </span>

                        </td>

                        {/* Action */}

                        <td className="py-3 text-right">

                          <button
                            onClick={() =>
                              handleDeleteStudent(
                                student
                              )
                            }
                            disabled={
                              deletingId ===
                              student._id
                            }
                            className="px-3 py-1.5 rounded-lg bg-[#e0e5ec] shadow-[2px_2px_5px_rgb(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.7)] text-rose-600 font-bold text-[10px] active:scale-95 transition disabled:opacity-50"
                          >
                            {deletingId ===
                            student._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-10 text-slate-500"
                    >
                      No students found in database.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        </div>
      )}

      {/* =====================================================
          Add Student Modal
      ====================================================== */}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div
            className={`${neumorphicCard} w-full max-w-3xl bg-[#e0e5ec] max-h-[92vh] overflow-y-auto`}
          >

            <div className="flex justify-between items-center mb-5 border-b border-slate-300 pb-3">

              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Add New Student
                </h3>

                <p className="text-[10px] text-slate-500 mt-1">
                  Student photo will be uploaded to the backend server.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="text-rose-600 font-bold text-sm w-8 h-8 rounded-full bg-[#e0e5ec] shadow-[3px_3px_6px_rgb(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.8)] flex items-center justify-center disabled:opacity-50"
              >
                ✕
              </button>

            </div>

            {/* Modal Error */}

            {errorMsg && (
              <div className="mb-5 p-3 bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            <form
              onSubmit={handleAddStudent}
              className="space-y-4"
            >

              {/* =================================================
                  PHOTO
              ================================================== */}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">
                  Student Photo
                </label>

                <div className="flex items-center gap-4">

                  <div className="w-20 h-20 rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] flex items-center justify-center overflow-hidden border border-white/30">

                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Student preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">
                        👤
                      </span>
                    )}

                  </div>

                  <div>

                    <label className="cursor-pointer inline-block px-4 py-2.5 bg-[#e0e5ec] shadow-[3px_3px_6px_rgb(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgb(163,177,198,0.6)] text-slate-700 font-bold text-xs rounded-xl transition">
                      📤 Upload Image

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    <p className="text-[10px] text-slate-400 mt-2">
                      JPG, JPEG, PNG or WEBP • Maximum 5 MB
                    </p>

                    {photoFile && (
                      <p className="text-[10px] text-emerald-600 font-bold mt-1">
                        ✓ {photoFile.name}
                      </p>
                    )}

                  </div>

                </div>
              </div>

              {/* =================================================
                  NAME
              ================================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={neumorphicInset}
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={neumorphicInset}
                    placeholder="Last name"
                  />
                </div>

              </div>

              {/* =================================================
                  ADMISSION
              ================================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Admission Number
                  </label>

                  <input
                    type="text"
                    name="admissionNo"
                    value={formData.admissionNo}
                    onChange={handleInputChange}
                    required
                    className={neumorphicInset}
                    placeholder="ADM-001"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Roll Number
                  </label>

                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    className={neumorphicInset}
                    placeholder="Roll No"
                  />
                </div>

              </div>

              {/* =================================================
                  GENDER / DOB / ADMISSION DATE / STATUS
              ================================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={neumorphicInset}
                  >
                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={neumorphicInset}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Admission Date
                  </label>

                  <input
                    type="date"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleInputChange}
                    className={neumorphicInset}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={neumorphicInset}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>

              </div>

              {/* =================================================
                  CLASS / SECTION
              ================================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Class
                  </label>

                  <select
                    name="classOption"
                    value={formData.classOption}
                    onChange={handleInputChange}
                    className={neumorphicInset}
                  >
                    <option value="SEO">
                      SEO
                    </option>

                    <option value="WordPress">
                      WordPress
                    </option>

                    <option value="Graphic Designing">
                      Graphic Designing
                    </option>

                    <option value="Web Development">
                      Web Development
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Section
                  </label>

                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    required
                    className={neumorphicInset}
                    placeholder="A"
                  />
                </div>

              </div>

              {/* =================================================
                  PARENT
              ================================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Father / Guardian Name
                  </label>

                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    required
                    className={neumorphicInset}
                    placeholder="Father name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Parent Phone / WhatsApp
                  </label>

                  <input
                    type="text"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    required
                    className={neumorphicInset}
                    placeholder="03XX-XXXXXXX"
                  />
                </div>

              </div>

              {/* =================================================
                  ADDRESS
              ================================================== */}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={neumorphicInset}
                  placeholder="House #, Street, City"
                />
              </div>

              {/* =================================================
                  BUTTONS
              ================================================== */}

              <div className="flex justify-end gap-3 pt-5 border-t border-slate-300">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#e0e5ec] shadow-[3px_3px_6px_rgb(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.8)] text-slate-600 rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Student"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default StudentList;
