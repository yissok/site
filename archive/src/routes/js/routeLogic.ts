import type { RouteData, Directions, Record } from "./routeData";
import { DEFAULT_DIRECTIONS, useLiveMapData } from "./routeData";
import { cleanRouteData } from "./routeData";

const apiKey = import.meta.env.VITE_MAPS_API_KEY;
console.log(apiKey === undefined ? "no api key" : "api key was found");

export async function getDirectionsUrlApi(
  origin: string,
  destination: string,
  arrivalTime: string
) {
  const params = new URLSearchParams({
    origin,
    destination,
    arrival_time: arrivalTime,
    mode: "transit",
    key: apiKey,
    alternatives: "true",
  });
  return `/api/directions?${params.toString()}`;
}

export async function fetchRouteData(url: string): Promise<RouteData> {
  try {
    let a = `{"routes": [{"fare": {"currency": "GBP","text": "£2.70","value": 2.7},"legs": [{"arrival_time": {"text": "1:14 PM","time_zone": "Europe/London","value": 1731244485},"departure_time": {"text": "1:02 PM","time_zone": "Europe/London","value": 1731243767},"distance": {"text": "2.9 km","value": 2877},"duration": {"text": "12 mins","value": 718},"end_address": "Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","start_address": "London Bridge, London EC4R 3TN, UK","steps": [{"distance": {"text": "0.5 km","value": 525},"duration": {"text": "5 mins","value": 279},"html_instructions": "Walk to Bank Station","travel_mode": "WALKING"},{"distance": {"text": "2.3 km","value": 2270},"duration": {"text": "5 mins","value": 307},"html_instructions": "Subway towards Ealing Broadway","transit_details": {"arrival_stop": {"location": {"lat": 51.5176646,"lng": -0.119053},"name": "Holborn"},"arrival_time": {"text": "1:12 PM","time_zone": "Europe/London","value": 1731244364},"departure_stop": {"location": {"lat": 51.5134661,"lng": -0.0883002},"name": "Bank Station"},"departure_time": {"text": "1:07 PM","time_zone": "Europe/London","value": 1731244057},"headsign": "Ealing Broadway","headway": 180,"line": {"agencies": [{"name": "Transport for London","url": "https://tfl.gov.uk/modes/tube/"}],"color": "#da291c","name": "Central Line","short_name": "Central","text_color": "#ffffff","url": "https://tfl.gov.uk/modes/tube/","vehicle": {"icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/subway2.png","local_icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/uk-london-underground.png","name": "Subway","type": "SUBWAY"}},"num_stops": 3},"travel_mode": "TRANSIT"},{"distance": {"text": "82 m","value": 82},"duration": {"text": "2 mins","value": 121},"html_instructions": "Walk to Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","travel_mode": "WALKING"}]}]},{"fare": {"currency": "GBP","text": "£2.70","value": 2.7},"legs": [{"arrival_time": {"text": "1:11 PM","time_zone": "Europe/London","value": 1731244305},"departure_time": {"text": "12:59 PM","time_zone": "Europe/London","value": 1731243587},"distance": {"text": "2.9 km","value": 2877},"duration": {"text": "12 mins","value": 718},"end_address": "Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","start_address": "London Bridge, London EC4R 3TN, UK","steps": [{"distance": {"text": "0.5 km","value": 525},"duration": {"text": "5 mins","value": 279},"html_instructions": "Walk to Bank Station","travel_mode": "WALKING"},{"distance": {"text": "2.3 km","value": 2270},"duration": {"text": "5 mins","value": 307},"html_instructions": "Subway towards West Ruislip","transit_details": {"arrival_stop": {"location": {"lat": 51.5176646,"lng": -0.119053},"name": "Holborn"},"arrival_time": {"text": "1:09 PM","time_zone": "Europe/London","value": 1731244184},"departure_stop": {"location": {"lat": 51.5134661,"lng": -0.0883002},"name": "Bank Station"},"departure_time": {"text": "1:04 PM","time_zone": "Europe/London","value": 1731243877},"headsign": "West Ruislip","headway": 180,"line": {"agencies": [{"name": "Transport for London","url": "https://tfl.gov.uk/modes/tube/"}],"color": "#da291c","name": "Central Line","short_name": "Central","text_color": "#ffffff","url": "https://tfl.gov.uk/modes/tube/","vehicle": {"icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/subway2.png","local_icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/uk-london-underground.png","name": "Subway","type": "SUBWAY"}},"num_stops": 3},"travel_mode": "TRANSIT"},{"distance": {"text": "82 m","value": 82},"duration": {"text": "2 mins","value": 121},"html_instructions": "Walk to Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","travel_mode": "WALKING"}]}]},{"fare": {"currency": "GBP","text": "£2.70","value": 2.7},"legs": [{"arrival_time": {"text": "1:08 PM","time_zone": "Europe/London","value": 1731244125},"departure_time": {"text": "12:56 PM","time_zone": "Europe/London","value": 1731243407},"distance": {"text": "2.9 km","value": 2877},"duration": {"text": "12 mins","value": 718},"end_address": "Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","start_address": "London Bridge, London EC4R 3TN, UK","steps": [{"distance": {"text": "0.5 km","value": 525},"duration": {"text": "5 mins","value": 279},"html_instructions": "Walk to Bank Station","travel_mode": "WALKING"},{"distance": {"text": "2.3 km","value": 2270},"duration": {"text": "5 mins","value": 307},"html_instructions": "Subway towards White City","transit_details": {"arrival_stop": {"location": {"lat": 51.5176646,"lng": -0.119053},"name": "Holborn"},"arrival_time": {"text": "1:06 PM","time_zone": "Europe/London","value": 1731244004},"departure_stop": {"location": {"lat": 51.5134661,"lng": -0.0883002},"name": "Bank Station"},"departure_time": {"text": "1:01 PM","time_zone": "Europe/London","value": 1731243697},"headsign": "White City","headway": 180,"line": {"agencies": [{"name": "Transport for London","url": "https://tfl.gov.uk/modes/tube/"}],"color": "#da291c","name": "Central Line","short_name": "Central","text_color": "#ffffff","url": "https://tfl.gov.uk/modes/tube/","vehicle": {"icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/subway2.png","local_icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/uk-london-underground.png","name": "Subway","type": "SUBWAY"}},"num_stops": 3},"travel_mode": "TRANSIT"},{"distance": {"text": "82 m","value": 82},"duration": {"text": "2 mins","value": 121},"html_instructions": "Walk to Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","travel_mode": "WALKING"}]}]},{"fare": {"currency": "GBP","text": "£2.70","value": 2.7},"legs": [{"arrival_time": {"text": "1:05 PM","time_zone": "Europe/London","value": 1731243945},"departure_time": {"text": "12:53 PM","time_zone": "Europe/London","value": 1731243227},"distance": {"text": "2.9 km","value": 2877},"duration": {"text": "12 mins","value": 718},"end_address": "Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","start_address": "London Bridge, London EC4R 3TN, UK","steps": [{"distance": {"text": "0.5 km","value": 525},"duration": {"text": "5 mins","value": 279},"html_instructions": "Walk to Bank Station","travel_mode": "WALKING"},{"distance": {"text": "2.3 km","value": 2270},"duration": {"text": "5 mins","value": 307},"html_instructions": "Subway towards West Ruislip","transit_details": {"arrival_stop": {"location": {"lat": 51.5176646,"lng": -0.119053},"name": "Holborn"},"arrival_time": {"text": "1:03 PM","time_zone": "Europe/London","value": 1731243824},"departure_stop": {"location": {"lat": 51.5134661,"lng": -0.0883002},"name": "Bank Station"},"departure_time": {"text": "12:58 PM","time_zone": "Europe/London","value": 1731243517},"headsign": "West Ruislip","headway": 180,"line": {"agencies": [{"name": "Transport for London","url": "https://tfl.gov.uk/modes/tube/"}],"color": "#da291c","name": "Central Line","short_name": "Central","text_color": "#ffffff","url": "https://tfl.gov.uk/modes/tube/","vehicle": {"icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/subway2.png","local_icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/uk-london-underground.png","name": "Subway","type": "SUBWAY"}},"num_stops": 3},"travel_mode": "TRANSIT"},{"distance": {"text": "82 m","value": 82},"duration": {"text": "2 mins","value": 121},"html_instructions": "Walk to Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","travel_mode": "WALKING"}]}]},{"fare": {"currency": "GBP","text": "£2.70","value": 2.7},"legs": [{"arrival_time": {"text": "1:03 PM","time_zone": "Europe/London","value": 1731243825},"departure_time": {"text": "12:51 PM","time_zone": "Europe/London","value": 1731243107},"distance": {"text": "2.9 km","value": 2877},"duration": {"text": "12 mins","value": 718},"end_address": "Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","start_address": "London Bridge, London EC4R 3TN, UK","steps": [{"distance": {"text": "0.5 km","value": 525},"duration": {"text": "5 mins","value": 279},"html_instructions": "Walk to Bank Station","travel_mode": "WALKING"},{"distance": {"text": "2.3 km","value": 2270},"duration": {"text": "5 mins","value": 307},"html_instructions": "Subway towards Ealing Broadway","transit_details": {"arrival_stop": {"location": {"lat": 51.5176646,"lng": -0.119053},"name": "Holborn"},"arrival_time": {"text": "1:01 PM","time_zone": "Europe/London","value": 1731243704},"departure_stop": {"location": {"lat": 51.5134661,"lng": -0.0883002},"name": "Bank Station"},"departure_time": {"text": "12:56 PM","time_zone": "Europe/London","value": 1731243397},"headsign": "Ealing Broadway","headway": 180,"line": {"agencies": [{"name": "Transport for London","url": "https://tfl.gov.uk/modes/tube/"}],"color": "#da291c","name": "Central Line","short_name": "Central","text_color": "#ffffff","url": "https://tfl.gov.uk/modes/tube/","vehicle": {"icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/subway2.png","local_icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/uk-london-underground.png","name": "Subway","type": "SUBWAY"}},"num_stops": 3},"travel_mode": "TRANSIT"},{"distance": {"text": "82 m","value": 82},"duration": {"text": "2 mins","value": 121},"html_instructions": "Walk to Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","travel_mode": "WALKING"}]}]},{"fare": {"currency": "GBP","text": "£1.75","value": 1.75},"legs": [{"arrival_time": {"text": "1:12 PM","time_zone": "Europe/London","value": 1731244340},"departure_time": {"text": "12:51 PM","time_zone": "Europe/London","value": 1731243089},"distance": {"text": "3.0 km","value": 2981},"duration": {"text": "21 mins","value": 1251},"end_address": "Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","start_address": "London Bridge, London EC4R 3TN, UK","steps": [{"distance": {"text": "0.6 km","value": 604},"duration": {"text": "9 mins","value": 567},"html_instructions": "Walk to Bank Station / Cornhill (Stop E)","travel_mode": "WALKING"},{"distance": {"text": "2.3 km","value": 2277},"duration": {"text": "10 mins","value": 595},"html_instructions": "Bus towards Tottenham Court Road","transit_details": {"arrival_stop": {"location": {"lat": 51.5176779,"lng": -0.1185255},"name": "Holborn Station (Stop K)"},"arrival_time": {"text": "1:11 PM","time_zone": "Europe/London","value": 1731244260},"departure_stop": {"location": {"lat": 51.5132646,"lng": -0.0876182},"name": "Bank Station / Cornhill (Stop E)"},"departure_time": {"text": "1:01 PM","time_zone": "Europe/London","value": 1731243665},"headsign": "Tottenham Court Road","line": {"agencies": [{"name": "Transport for London","url": "https://tfl.gov.uk/modes/tube/"}],"color": "#ce312d","name": "London Buses route 8","short_name": "8","text_color": "#ffffff","url": "https://tfl.gov.uk/","vehicle": {"icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/bus2.png","local_icon": "//maps.gstatic.com/mapfiles/transit/iw2/6/uk-london-bus.png","name": "Bus","type": "BUS"}},"num_stops": 9},"travel_mode": "TRANSIT"},{"distance": {"text": "0.1 km","value": 100},"duration": {"text": "1 min","value": 80},"html_instructions": "Walk to Holborn, Underground Ltd, Holborn Station, Kingsway, London WC2B 6AA, UK","travel_mode": "WALKING"}]}]}]}`;
    var data: RouteData;
    if (useLiveMapData) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      data = await response.json();
    } else {
      data = JSON.parse(a);
    }
    const cleanedData = cleanRouteData(data);
    return cleanedData;
  } catch (error) {
    console.error("Error fetching route data:", error);
    return {
      routes: [],
    };
  }
}

export async function handleCheckboxChange(
  event: Event,
  userLocation: string,
  timetableLocation: string
): Promise<Directions> {
  const input = event.target as HTMLInputElement;
  const time = input.value;
  return await calculateWaitingTimes(userLocation, timetableLocation, time);
}

export async function calculateWaitingTimes(
  userLocation: string,
  timetableLocation: string,
  selectedTime: string
): Promise<Directions> {
  if (!userLocation || !timetableLocation) {
    alert("Please enter location");
    return DEFAULT_DIRECTIONS;
  }
  const now: Date = new Date();
  let init_directions: Directions = DEFAULT_DIRECTIONS;
  const [hours, minutes] = selectedTime.split(":").map(Number);
  const dateWithTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
    0
  );
  var unixSelectedTime = Math.floor(dateWithTime.getTime() / 1000);
  const unixTimeNow = Math.floor(now.getTime() / 1000);
  if (unixSelectedTime < unixTimeNow) {
    unixSelectedTime += 86400;
  }
  const directionsUrl = await getDirectionsUrlApi(
    userLocation,
    timetableLocation,
    unixSelectedTime.toString()
  );
  const routeData: RouteData = await fetchRouteData(directionsUrl);
  console.log("Parsed route data:", routeData);


  let init_records: Record[] = [];
  const routes = routeData?.routes || [];
  if (routes.length > 0) {
    init_records = routeData!.routes.flatMap(
      (route, routeIndex) => {
        return route.legs.map((leg, legIndex) => {
          return {
            id: routeIndex * 100 + legIndex + 1,
            start: new Date(leg.departure_time.value * 1000),
            end: new Date(leg.arrival_time.value * 1000),
            content: `at ${selectedTime}`,
          };
        });
      }
    );
  }
  init_directions = {
    selectedTime: selectedTime,
    unixTime: unixSelectedTime,
    routeData,
    records: init_records
  };
  return init_directions;
}
