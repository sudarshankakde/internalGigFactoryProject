import React from "react";
import {
  Briefcase,
  Calendar,
  Clock,
  Users,
  Tag,
  ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PublicProject = () => {
  const navigate = useNavigate();

  const project = {
    title: "Premium Branding Guidelines & UI Design System",
    client: "Internal Client",
    status: "not_started",
    project_type: "Fixed",
    priority: "Medium",
    category: "Design & Creative",
    budget: 150000,
    startDate: "TBD",
    hours: "TBD",
    deadline: "TBD",
    applicants: 3,
    description:
      "Redefining the brand strategy, logo guidelines, vector typography guidelines, color palettes, and establishing a unified UI Design System in Figma.",
    skills: [
      "Figma",
      "UI/UX Design",
      "Branding System",
      "Vector Graphics",
    ],
    deliverables: [
      "Design System",
      "Branding",
      "Figma Prototypes",
    ],
    milestones: [
      {
        id: 1,
        title: "Brand Identity Strategy & Logo Mockups",
        description:
          "Delivery of 3 creative concept direction packages and core vector assets.",
        weight: 33.3,
        amount: 50000,
      },
      {
        id: 2,
        title: "Complete Component Library & Prototypes",
        description:
          "Delivery of Figma library with responsive components, buttons and state sheets.",
        weight: 66.7,
        amount: 100000,
      },
    ],
  };

  const handleApply = () => {
    // const token = localStorage.getItem("token");

    // if (!token) {
    //   navigate("/");
    //   return;
    // }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0f1014] text-white p-6">
      {/* HEADER */}

      <div className="border-b border-[#23232a] pb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 text-xs border border-[#23232a] rounded">
            FIXED
          </span>

          <span className="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-400 rounded">
            MEDIUM PRIORITY
          </span>

          <span className="px-2 py-1 text-xs border border-[#23232a] rounded">
            DESIGN & CREATIVE
          </span>
        </div>

        <h1 className="text-4xl font-bold">
          {project.title}
        </h1>

        <div className="mt-2 text-gray-400">
          {project.client}
        </div>
      </div>

      {/* SUMMARY */}

      <div className="grid lg:grid-cols-5 gap-8 py-8 border-b border-[#23232a]">

        <div>
          <div className="text-gray-500 text-xs uppercase">
            Budget
          </div>
          <div className="text-xl font-bold mt-2">
            ₹1,50,000
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-xs uppercase">
            Start Date
          </div>
          <div className="text-xl font-bold mt-2">
            TBD
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-xs uppercase">
            Est Hours
          </div>
          <div className="text-xl font-bold mt-2">
            TBD
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-xs uppercase">
            Deadline
          </div>
          <div className="text-xl font-bold mt-2">
            TBD
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-xs uppercase">
            Applicants
          </div>
          <div className="text-xl font-bold mt-2">
            3 Users
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="grid lg:grid-cols-[1.7fr_0.9fr] gap-6 mt-8">

        {/* LEFT SIDE */}

        <div className="space-y-6">

          {/* DESCRIPTION */}

          <div className="bg-[#121215] border border-[#23232a] rounded-lg p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Briefcase size={18} />
              Project Description
            </h3>

            <p className="text-gray-400 text-sm leading-7">
              {project.description}
            </p>
          </div>

          {/* SKILLS */}

          <div className="bg-[#121215] border border-[#23232a] rounded-lg p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Tag size={18} />
              Required Skills & Expertise
            </h3>

            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-[#23232a] px-3 py-1 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* DELIVERABLES */}

          <div className="bg-[#121215] border border-[#23232a] rounded-lg p-6">
            <h3 className="font-bold mb-4">
              Project Deliverables
            </h3>

            <div className="flex flex-wrap gap-2">
              {project.deliverables.map((item) => (
                <span
                  key={item}
                  className="text-green-400 border border-[#23232a] px-3 py-1 rounded text-xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* MILESTONES */}

          <div className="bg-[#121215] border border-[#23232a] rounded-lg p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <ClipboardList size={18} />
              Project Milestones
            </h3>

            <div className="space-y-4">

              {project.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="border border-[#23232a] bg-[#0c0c0e] rounded-lg p-4"
                >
                  <div className="flex justify-between">

                    <div>
                      <h4 className="font-semibold">
                        {milestone.title}
                      </h4>

                      <p className="text-gray-400 text-sm mt-2">
                        {milestone.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-blue-400 text-xs">
                        Weight {milestone.weight}%
                      </div>

                      <div className="text-green-400 font-bold">
                        ₹
                        {milestone.amount.toLocaleString(
                          "en-IN"
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}

        <div>

          <div className="bg-[#121215] border border-[#23232a] rounded-lg p-5 mb-6">

            <div className="text-gray-500 text-xs uppercase">
              Applicants
            </div>

            <div className="text-2xl font-bold mt-2">
              3 Users
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">
                Apply
              </h4>

              <p className="text-gray-500 text-xs mt-1">
                Submit your request to admin.
              </p>

              <button
                onClick={handleApply}
                className="w-full mt-4 bg-[#9EF01A] text-black py-2 rounded font-bold"
              >
                Apply
              </button>
            </div>

          </div>

          

        </div>

      </div>
    </div>
  );
};

export default PublicProject;