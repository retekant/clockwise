// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $index from "./routes/index.tsx";
import * as $Calendar from "./islands/Calendar.tsx";
import * as $DataManager from "./islands/DataManager.tsx";
import * as $ProgressTracker from "./islands/ProgressTracker.tsx";
import * as $Settings from "./islands/Settings.tsx";
import * as $ShiftTracker from "./islands/ShiftTracker.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/Calendar.tsx": $Calendar,
    "./islands/DataManager.tsx": $DataManager,
    "./islands/ProgressTracker.tsx": $ProgressTracker,
    "./islands/Settings.tsx": $Settings,
    "./islands/ShiftTracker.tsx": $ShiftTracker,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
