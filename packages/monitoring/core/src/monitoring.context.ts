'use client';

import { createContext } from 'react';

import { ConsoleMonitoringService } from './console-monitoring.service';
import { MonitoringService } from './monitoring.service';

export const MonitoringContext = createContext<MonitoringService>(
  new ConsoleMonitoringService(),
);
