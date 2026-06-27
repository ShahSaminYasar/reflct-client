import { Suspense } from "react";
import PublicLessonsPage from "./PublicLessonsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PublicLessonsPage />
    </Suspense>
  );
}
