import Navbar from "@/components/layout/Navbar";
// import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "./dashboard/page";
import { redirect } from "next/navigation";

export default function Home() {
  redirect('/dashboard')

}
