// import React from "react";
// import {
//   Wrench,
//   Zap,
//   Car,
//   Paintbrush,
//   Hammer,
//   Trash2,
//   Home,
//   Settings,
//   GraduationCap,
//   Truck,
//   Laptop

// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const categories = [
//   {
//     name: "Plumbing",
//     icon: <Wrench size={28} />,
//   },
//   {
//     name: "Electrician",
//     icon: <Zap size={28} />,
//   },
//   {
//     name: "Driver",
//     icon: <Car size={28} />,
//   },
//   {
//     name: "Painter",
//     icon: <Paintbrush size={28} />,
//   },
//   {
//     name: "Carpenter",
//     icon: <Hammer size={28} />,
//   },
//   {
//     name: "Cleaning",
//     icon: <Trash2 size={28} />,
//   },
//   {
//     name: "Home Repair",
//     icon: <Home size={28} />,
//   },
//   {
//     name: "Appliance Repair",
//     icon: <Settings size={28} />,
//   },
//   {
//     name: "Mechanic",
//     icon: <Wrench size={28} />,
//   },
//   {
//     name: "Tutor",
//     icon: <GraduationCap size={28} />,
//   },
//   {
//     name: "Delivery",
//     icon: <Truck size={28} />,
//   },
//   {
//     name: "Tech Support",
//     icon: <Laptop size={28} />,
//   },
// ];

// const Category = () => {
//   const navigate = useNavigate();
//   return (
//     <section className="py-16 px-6 bg-gray-50 mt-18">
//       {/* Heading */}
//       <div className="text-center mb-12">
//         <h2 className="text-3xl font-bold text-gray-800">
//           Explore Service Categories
//         </h2>
//         <p className="text-gray-500 mt-2">
//           Find the right professionals for your needs
//         </p>
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
//         {categories.map((cat, index) => (
//           <div
//             key={index}
//             onClick={()=>navigate(`/services?service=${cat.name}`)}
//             className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-center cursor-pointer group"
//           >
//             {/* Icon */}
//             <div className="mb-4 text-indigo-600 group-hover:scale-110 transition-transform">
//               {cat.icon}
//             </div>

//             {/* Title */}
//             <h3 className="text-gray-700 font-medium text-lg text-center">
//               {cat.name}
//             </h3>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Category;

import React from "react";
import {
  Wrench,
  Zap,
  Car,
  Paintbrush,
  Hammer,
  Trash2,
  Home,
  Settings,
  GraduationCap,
  Truck,
  Laptop,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Plumbing", icon: <Wrench size={28} /> },
  { name: "Electrician", icon: <Zap size={28} /> },
  { name: "Driver", icon: <Car size={28} /> },
  { name: "Painter", icon: <Paintbrush size={28} /> },
  { name: "Carpenter", icon: <Hammer size={28} /> },
  { name: "Cleaning", icon: <Trash2 size={28} /> },
  { name: "Home Repair", icon: <Home size={28} /> },
  { name: "Appliance Repair", icon: <Settings size={28} /> },
  { name: "Mechanic", icon: <Wrench size={28} /> },
  { name: "Tutor", icon: <GraduationCap size={28} /> },
  { name: "Delivery", icon: <Truck size={28} /> },
  { name: "Tech Support", icon: <Laptop size={28} /> },
];

const Category = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-20 px-4 md:px-10 lg:px-20 xl:px-28 bg-zinc-950 text-white">
      
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Explore Service Categories
        </h2>
        <p className="text-gray-400 mt-3 text-sm md:text-base">
          Find the right professionals for your needs
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => navigate(`/services?service=${cat.name}`)}
            className="group cursor-pointer bg-zinc-900 border border-white/5 rounded-2xl 
            p-5 sm:p-6 flex flex-col items-center justify-center 
            hover:border-indigo-500/40 hover:bg-zinc-800 
            transition-all duration-300"
          >
            {/* Icon */}
            <div className="mb-3 text-indigo-500 group-hover:scale-110 transition-transform duration-300">
              {cat.icon}
            </div>

            {/* Title */}
            <h3 className="text-gray-300 group-hover:text-white text-sm sm:text-base font-medium text-center">
              {cat.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;