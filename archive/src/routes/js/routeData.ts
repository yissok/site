//constants
export var useLiveMapData = true;
useLiveMapData = false;

export const DEFAULT_DIRECTIONS = {
  selectedTime: "00:00",
  unixTime: 0,
  routeData: undefined,
  records: []
};

//definitions
export interface Directions {
  selectedTime: string;
  unixTime: number;
  routeData?: RouteData;
  records: Record[];
}

export type DirState = {
  newUserLocation: string;
  newTimetableLocation: string;
  newSelectedTime: string;
  newDirections: Directions;
  newRecords: Record[] | undefined;
};

export interface Record {
  id: number;
  start: Date;
  end: Date;
  content: string;
}

export interface RouteData {
  routes: Route[];
}

interface Route {
  fare?: Fare;
  legs: Leg[];
}

interface Fare {
  text: string;
  value: number;
}

interface Leg {
  arrival_time: TimeInfo;
  departure_time: TimeInfo;
  distance: Measurement;
  duration: Measurement;
  end_address: string;
  start_address: string;
  steps: Step[];
}

interface TimeInfo {
  text: string;
  time_zone: string;
  value: number;
}

interface Measurement {
  text: string;
  value: number;
}

export interface Step {
  distance: Measurement;
  duration: Measurement;
  html_instructions: string;
  transit_details?: TransitDetails;
  travel_mode: string;
}

interface TransitDetails {
  arrival_stop: {
    name: string;
  };
  arrival_time: TimeInfo;
  departure_stop: {
    name: string;
  };
  departure_time: TimeInfo;
  headsign: string;
  headway: number;
  line: Line;
  num_stops: number;
}

interface Line {
  agencies: {
    name: string;
    url: string;
  }[];
  color: string;
  name: string;
  short_name: string;
  text_color: string;
  url: string;
  vehicle: Vehicle;
}

interface Vehicle {
  icon: string;
  local_icon: string;
  name: string;
  type: string;
}

export function cleanRouteData(data: RouteData): RouteData {
  return {
    routes: data.routes.map((route) => ({
      fare: route.fare ? { ...route.fare } : undefined,
      legs: route.legs.map((leg) => ({
        arrival_time: { ...leg.arrival_time },
        departure_time: { ...leg.departure_time },
        distance: { ...leg.distance },
        duration: { ...leg.duration },
        end_address: leg.end_address,
        start_address: leg.start_address,
        steps: leg.steps.map((step) => ({
          distance: { ...step.distance },
          duration: { ...step.duration },
          html_instructions: step.html_instructions,
          transit_details: step.transit_details
            ? {
              arrival_stop: { ...step.transit_details.arrival_stop },
              arrival_time: { ...step.transit_details.arrival_time },
              departure_stop: { ...step.transit_details.departure_stop },
              departure_time: { ...step.transit_details.departure_time },
              headsign: step.transit_details.headsign,
              headway: step.transit_details.headway,
              line: {
                ...step.transit_details.line,
                agencies: step.transit_details.line.agencies.map(
                  (agency) => ({
                    ...agency,
                  })
                ),
                vehicle: { ...step.transit_details.line.vehicle },
              },
              num_stops: step.transit_details.num_stops,
            }
            : undefined,
          travel_mode: step.travel_mode,
        })),
      })),
    })),
  };
}
