import { Suspense } from "react";
import { BoardPage } from "../board-page";
export default function NoticesPage(){ return <Suspense fallback={null}><BoardPage board="notice"/></Suspense>; }
