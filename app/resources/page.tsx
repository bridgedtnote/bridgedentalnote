import { Suspense } from "react";
import { BoardPage } from "../board-page";
export default function ResourcesPage(){ return <Suspense fallback={null}><BoardPage board="resource"/></Suspense>; }
