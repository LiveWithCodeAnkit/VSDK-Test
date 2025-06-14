
This project is a React-based application designed to visualize participant timelines and session health overviews for video meetings. It leverages the Shadcn UI library for styling and components, and uses Radix UI for accessible UI primitives.

## Project Structure

- **src/**: The main source directory containing all the application code.
  - **components/ui/**: Contains reusable UI components such as buttons, tabs, switches, and separators.
  - **lib/**: Contains utility functions and constants.
    - **constants/meetingData.ts**: Provides mock data for meeting sessions, including participant details and event timelines.
    - **utils.ts**: Contains utility functions for class name merging.
  - **screens/**: Contains the main screens and sections of the application.
    - **Frame/**: The main container for the application, which includes various sections.
      - **Frame.tsx**: The main component that assembles the different sections of the application.
      - **sections/**: Contains specific sections of the Frame.
        - **NavigationBarSection/**: Manages the navigation bar with time markers.
        - **ParticipantTimelineSection/**: Visualizes participant timelines with events like mic and webcam usage.
        - **SessionHealthOverviewSection/**: Displays an overview of session health with a toggle for showing participant timelines.

## Key Features

- **Participant Timeline Visualization**: Displays a timeline for each participant, showing events such as microphone and webcam usage, along with any errors encountered.
- **Session Health Overview**: Provides a quick overview of the session's health, with a toggle to show or hide participant timelines.
- **Navigation Bar**: Displays time markers for the session duration, allowing easy navigation through the timeline..

## Technologies Used

- **React**: For building the user interface.
- **Radix UI**: For accessible UI components.
- **Tailwind CSS**: For styling the application.
- **Day.js**: For date and time manipulation.
- **Vite**: For fast development and build tooling.

## Setup and Installation

1. **Clone the Repository**: 
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**: 
   ```bash
   npm install
   ```

3. **Run the Development Server**: 
   ```bash
   npm run dev
   ```

4. **Build for Production**: 
   ```bash
   npm run build
   ```

## Usage

- **Toggle Participant Timeline**: Use the switch in the Session Health Overview section to show or hide the participant timeline.
- **View Details**: Click on the "View details" button next to each participant to see more information about their session events.

## License

This project is licensed under the MIT License.

---

Feel free to adjust the description to better fit your project's specifics or to add any additional information you think is necessary.
