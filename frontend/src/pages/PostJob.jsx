// import React, { useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { useAddJobMutation } from "../redux/api/api";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const categories = [
//   "Plumbing",
//         "Electrician",
//         "Driver",
//         "Carpenter",
//         "Painter",
//         "Cleaner",
//         "Home Repair",
//         "Appliance Repair",
//         "Mechanic",
//         "Tutor",
//         "Delivery",
//         "Gardener",
//         "Cook",
//         "Tech Support",
//         "Photographer",
// ];

// const budgetTypes = [
//   "fixed",
//   "hourly",
//   "daily",
//   "weekly",
//   "monthly",
//   "yearly",
//   "negotiable",
// ];

// const PostJob = () => {
//   const navigate = useNavigate();
//   const [addJob, { isLoading }] = useAddJobMutation();

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     category: "",
//     location: "",
//     budgetType: "fixed",
//     budgetAmount: "",
//     skills: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const payload = {
//         ...form,
//         skills: form.skills
//           ? form.skills.split(",").map((s) => s.trim())
//           : [],
//         budgetAmount: Number(form.budgetAmount),
//       };

//       const res = await addJob(payload).unwrap();

//       toast.success(res.message);

//       setForm({
//         title: "",
//         description: "",
//         category: "",
//         location: "",
//         budgetType: "fixed",
//         budgetAmount: "",
//         skills: "",
//       });

//       navigate("/profile/client");
//     } catch (error) {
//       toast.error(error?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
//       <Navbar />

//       <div className="max-w-4xl mx-auto px-4 py-10">
//         <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10">
          
//           {/* HEADER */}
//           <h1 className="text-3xl font-bold text-center mb-2">
//             Post a Job
//           </h1>
//           <p className="text-center text-gray-500 mb-8">
//             Find the perfect worker for your task
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* TITLE */}
//             <input
//               type="text"
//               name="title"
//               placeholder="Job Title"
//               value={form.title}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
//               required
//             />

//             {/* DESCRIPTION */}
//             <textarea
//               name="description"
//               placeholder="Job Description"
//               value={form.description}
//               onChange={handleChange}
//               rows={5}
//               className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
//               required
//             />

//             {/* CATEGORY + LOCATION */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//               <select
//                 name="category"
//                 value={form.category}
//                 onChange={handleChange}
//                 className="p-3 border rounded-xl"
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="text"
//                 name="location"
//                 placeholder="Location (e.g. New Baneshwor, Kathmandu)"
//                 value={form.location}
//                 onChange={handleChange}
//                 className="p-3 border rounded-xl"
//                 required
//               />
//             </div>

//             {/* BUDGET TYPE + AMOUNT */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//               <select
//                 name="budgetType"
//                 value={form.budgetType}
//                 onChange={handleChange}
//                 className="p-3 border rounded-xl"
//               >
//                 {budgetTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="number"
//                 name="budgetAmount"
//                 placeholder="Budget Amount (NPR)"
//                 value={form.budgetAmount}
//                 onChange={handleChange}
//                 className="p-3 border rounded-xl"
//                 disabled={form.budgetType === "negotiable"}
//               />
//             </div>

//             {/* SKILLS */}
//             <input
//               type="text"
//               name="skills"
//               placeholder="Skills required (comma separated)"
//               value={form.skills}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-xl"
//             />

//             {/* SUBMIT */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
//             >
//               {isLoading ? "Posting..." : "Post Job"}
//             </button>

//           </form>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default PostJob;

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAddJobMutation } from "../redux/api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const categories = [
  "Plumbing",
  "Electrician",
  "Driver",
  "Carpenter",
  "Painter",
  "Cleaner",
  "Home Repair",
  "Appliance Repair",
  "Mechanic",
  "Tutor",
  "Delivery",
  "Gardener",
  "Cook",
  "Tech Support",
  "Photographer",
];

const budgetTypes = [
  "fixed",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "negotiable",
];

const PostJob = () => {
  const navigate = useNavigate();
  const [addJob, { isLoading }] = useAddJobMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    budgetType: "fixed",
    budgetAmount: "",
    skills: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim())
          : [],
        budgetAmount: Number(form.budgetAmount),
      };

      const res = await addJob(payload).unwrap();

      toast.success(res.message);

      setForm({
        title: "",
        description: "",
        category: "",
        location: "",
        budgetType: "fixed",
        budgetAmount: "",
        skills: "",
      });

      navigate("/profile/client");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-4 py-10 flex-1">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-6 md:p-10">

          {/* HEADER */}
          <h1 className="text-3xl font-bold text-center mb-2">
            Post a Job
          </h1>
          <p className="text-center text-zinc-400 mb-8">
            Find the perfect worker for your task
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* TITLE */}
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              required
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              placeholder="Job Description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              required
            />

            {/* CATEGORY + LOCATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
                required
              >
                <option value="" className="text-white">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-white">
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="location"
                placeholder="Location (e.g. Kathmandu)"
                value={form.location}
                onChange={handleChange}
                className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-indigo-500 outline-none"
                required
              />
            </div>

            {/* BUDGET */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <select
                name="budgetType"
                value={form.budgetType}
                onChange={handleChange}
                className="p-3 rounded-xl bg-zinc-800 border border-zinc-700"
              >
                {budgetTypes.map((type) => (
                  <option key={type} value={type} className="text-white">
                    {type}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="budgetAmount"
                placeholder="Budget Amount (NPR)"
                value={form.budgetAmount}
                onChange={handleChange}
                className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-indigo-500 outline-none disabled:opacity-50"
                disabled={form.budgetType === "negotiable"}
              />
            </div>

            {/* SKILLS */}
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              value={form.skills}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-indigo-500 outline-none"
            />

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {isLoading ? "Posting..." : "Post Job"}
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PostJob;