// import React from 'react'

// const Testimonials = () => {
//   return (
//         <div className="flex flex-wrap items-center justify-center gap-6 mt-20 pt-14">
//             <div className="text-sm w-80 border border-gray-200 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5">
//                 <div className="flex flex-col items-center px-5 py-4 relative">
//                     <img className="h-24 w-24 absolute -top-14 rounded-full" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="userImage1" />
//                     <div className="pt-8 text-center">
//                         <h1 className="text-lg font-medium text-gray-800">Donald Jackman</h1>
//                         <p className="text-gray-800/80">Content Creator</p>
//                     </div>
//                 </div>
//                 <p className="text-gray-500 px-6 text-center">I've been using prebuiltui for nearly two years, primarily for web pages and it has been incredibly user-friendly, making my work much easier.</p>
//                 <div className="flex justify-center pt-4">
//                     <div className="flex gap-0.5">
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                     </div>
//                 </div>
//             </div>
        
//             <div className="text-sm w-80 border border-gray-200 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5">
//                 <div className="flex flex-col items-center px-5 py-4 relative">
//                     <img className="h-24 w-24 absolute -top-14 rounded-full" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="userImage2" />
//                     <div className="pt-8 text-center">
//                         <h1 className="text-lg font-medium text-gray-800">Richard Nelson</h1>
//                         <p className="text-gray-800/80">Instagram Influencer</p>
//                     </div>
//                 </div>
//                 <p className="text-gray-500 px-6 text-center">I've been using this website for nearly a year, primarily for web apps and it has been incredibly amazing, making my work much easier.</p>
//                 <div className="flex justify-center pt-4">
//                     <div className="flex gap-0.5">
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                     </div>
//                 </div>
//             </div>
        
//             <div className="text-sm w-80 border border-gray-200 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5">
//                 <div className="flex flex-col items-center px-5 py-4 relative">
//                     <img className="h-24 w-24 absolute -top-14 rounded-full" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop" alt="userImage3" />
//                     <div className="pt-8 text-center">
//                         <h1 className="text-lg font-medium text-gray-800">James Washington</h1>
//                         <p className="text-gray-800/80">Marketing Manager</p>
//                     </div>
//                 </div>
//                 <p className="text-gray-500 px-6 text-center">I've been using this awesome website for nearly two years, primarily for my saas app and it has been incredibly user-friendly, making my work much easier.</p>
//                 <div className="flex justify-center pt-4">
//                     <div className="flex gap-0.5">
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                         <svg width="18" height="18" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" fill="#FF532E"/>
//                         </svg>
//                     </div>
//                 </div>
//             </div>
//         </div>
//   )
// }

// export default Testimonials


import React from "react";

const Testimonials = () => {
  return (
    <section className="bg-zinc-950 text-gray-300 py-20 px-6 md:px-16 lg:px-24 xl:px-32">
      
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          What Our Users Say
        </h2>
        <p className="text-gray-400 mt-3 text-sm md:text-base">
          Real experiences from people using our platform
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap items-center justify-center gap-10">
        
        {/* CARD 1 */}
        <div className="w-full sm:w-[320px] border border-white/10 rounded-2xl bg-zinc-900/70 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300 pb-6">
          <div className="flex flex-col items-center px-5 py-6 relative">
            <img
              className="h-20 w-20 md:h-24 md:w-24 absolute -top-12 rounded-full border-2 border-zinc-800"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
              alt="userImage1"
            />
            <div className="pt-12 text-center">
              <h1 className="text-lg font-medium text-white">
                Donald Jackman
              </h1>
              <p className="text-gray-400 text-sm">Content Creator</p>
            </div>
          </div>

          <p className="text-gray-400 px-6 text-center text-sm leading-relaxed">
            I've been using prebuiltui for nearly two years, primarily for web
            pages and it has been incredibly user-friendly, making my work much
            easier.
          </p>

          <div className="flex justify-center pt-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 22 20" fill="none">
                  <path
                    d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z"
                    fill="#f97316"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="w-full sm:w-[320px] border border-white/10 rounded-2xl bg-zinc-900/70 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300 pb-6">
          <div className="flex flex-col items-center px-5 py-6 relative">
            <img
              className="h-20 w-20 md:h-24 md:w-24 absolute -top-12 rounded-full border-2 border-zinc-800"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
              alt="userImage2"
            />
            <div className="pt-12 text-center">
              <h1 className="text-lg font-medium text-white">
                Richard Nelson
              </h1>
              <p className="text-gray-400 text-sm">Instagram Influencer</p>
            </div>
          </div>

          <p className="text-gray-400 px-6 text-center text-sm leading-relaxed">
            I've been using this website for nearly a year, primarily for web
            apps and it has been incredibly amazing, making my work much easier.
          </p>

          <div className="flex justify-center pt-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 22 20" fill="none">
                  <path
                    d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z"
                    fill="#f97316"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="w-full sm:w-[320px] border border-white/10 rounded-2xl bg-zinc-900/70 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300 pb-6">
          <div className="flex flex-col items-center px-5 py-6 relative">
            <img
              className="h-20 w-20 md:h-24 md:w-24 absolute -top-12 rounded-full border-2 border-zinc-800"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
              alt="userImage3"
            />
            <div className="pt-12 text-center">
              <h1 className="text-lg font-medium text-white">
                James Washington
              </h1>
              <p className="text-gray-400 text-sm">Marketing Manager</p>
            </div>
          </div>

          <p className="text-gray-400 px-6 text-center text-sm leading-relaxed">
            I've been using this awesome website for nearly two years,
            primarily for my saas app and it has been incredibly user-friendly,
            making my work much easier.
          </p>

          <div className="flex justify-center pt-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 22 20" fill="none">
                  <path
                    d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z"
                    fill="#f97316"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;