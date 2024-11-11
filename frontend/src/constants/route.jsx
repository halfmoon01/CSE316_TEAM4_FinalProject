import Announcement from "@/pages/Announcement";
import NotFound from "@/pages/NotFound";
import HomeScreen from "@/pages/HomeScreen";
import AdvisoryCommittee from "@/pages/AdvisoryCommittee";
import Executives from "@/pages/Executives";
import Gallery from "@/pages/Gallery";
import Login from "@/pages/Login";
import MyInformation from "@/pages/MyInformation";
import SignUp from "@/pages/SignUp";
import EditAnnouncement from "@/pages/EditAnnouncement";
import EditGallery from "@/pages/EditGallery";
import ManageAccounts from "@/pages/ManageAccounts";
import Welcome from "@/pages/Welcome";

export const ROUTES = [
  {
    PATH: "/HomeScreen",
    ELEMENT: HomeScreen,
  },
  {
    PATH: "/",
    ELEMENT: HomeScreen,
  },
  {
    PATH: "/Gallery",
    ELEMENT: Gallery,
  },
  {
    PATH: "/Executives",
    ELEMENT: Executives,
  },
  {
    PATH: "/AdvisoryCommittee",
    ELEMENT: AdvisoryCommittee,
  },
  {
    PATH: "/Announcement",
    ELEMENT: Announcement,
  },
  {
    PATH: "/Login",
    ELEMENT: Login,
  },
  {
    PATH: "/MyInformation",
    ELEMENT: MyInformation,
  },
  {
    PATH: "/SignUp",
    ELEMENT: SignUp,
  },
  {
    PATH: "/EditGallery",
    ELEMENT: EditGallery,
  },
  {
    PATH: "/EditAnnouncement",
    ELEMENT: EditAnnouncement,
  },
  {
    PATH: "/ManageAccounts",
    ELEMENT: ManageAccounts,
  },
  {
    PATH: "/Welcome",
    ELEMENT: Welcome,
  },
  {
    PATH: "/*",
    ELEMENT: NotFound,
  },
];
