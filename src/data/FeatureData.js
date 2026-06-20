import { FaAmbulance, FaHeartbeat, FaHospital, FaUsers } from "react-icons/fa";

export const featuredData = [
  {
    id: 1,
    title: "Emergency Blood Request",
    description: "Post urgent requests and get notified immediately.",
    content:
      "Our platform connects you with active donors in your area instantly to save lives.",
    icon: <FaHeartbeat className="text-3xl text-danger" />,
  },
  {
    id: 2,
    title: "Verified Donor Network",
    description: "Access a verified database of blood donors.",
    content:
      "Every profile is screened to ensure safety, reliability, and donor health standards.",
    icon: <FaUsers className="text-3xl text-danger" />,
  },
  {
    id: 3,
    title: "Hospital Partnership",
    description: "Work directly with major hospitals.",
    content:
      "We bridge the gap between supply and demand, ensuring blood reaches patients on time.",
    icon: <FaHospital className="text-3xl text-danger" />,
  },
  {
    id: 4,
    title: "Fast Response System",
    description: "Minimizing response time.",
    content:
      "Our system alerts nearby compatible donors as soon as a request is posted.",
    icon: <FaAmbulance className="text-3xl text-danger" />,
  },
];
