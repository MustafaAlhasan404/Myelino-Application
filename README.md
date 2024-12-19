# Myelino Application

Modern React Native planner application with timeline visualization and expiration tracking.

## Quick Start

Run these commands:

```typescript
npm install
npx expo start --clear
```

## API Services

### Plan Service (planService.ts)

The application uses a clean API client interface built with axios for handling all plan-related operations.

```typescript
export const planService = {
  // Fetch all plans
  getAll: () => axiosClient.get('/plan'),
  
  // Delete specific event
  deleteEvent: (eventId: string) => 
    axiosClient.delete(`/plan/event/${eventId}`),
  
  // Batch delete multiple plans
  deletePlans: (planIds: string[]) => 
    axiosClient.delete('/plan', { data: { plans: planIds } }),
  
  // Clear all planner data
  clearPlanner: () => 
    axiosClient.delete('/plan/clear-planner'),
  
  // Load test data
  loadMockData: () => 
    axiosClient.get('/plan/load-data')
};
```

### API Endpoints


| Endpoint              | Method | Description                |
| --------------------- | ------ | -------------------------- |
| `/plan`               | GET    | Retrieve all plans         |
| `/plan/event/:id`     | DELETE | Remove specific event      |
| `/plan`               | DELETE | Batch delete plans         |
| `/plan/clear-planner` | DELETE | Clear all planner data     |
| `/plan/load-data`     | GET    | Load mock data for testing |

### Implementation Details

* Centralized error handling
* Type-safe request/response cycles
* Efficient batch operations
* Clean separation of concerns
* Standardized response formatting

## Project Structure

```bash
myelino/
├── app/
│   ├── screens/
│   │   ├── planner.tsx      # Main dashboard
│   │   └── quickplans.tsx   # Quick plans view
├── components/     
│   ├── Plan.tsx            # Plan card component
│   ├── PlannedDate.tsx     # Timeline visualization
│   ├── CustomInput.tsx     # Input fields handler
│   ├── Scroll.tsx          # Navigation options
│   └── QuickPlanExpiration.tsx  # Expiration handling
├── services/       
│   ├── planService.ts      # API client interface
│   └── planStore.ts        # Zustand state management
└── helpers/       
    └── errorHandler.ts     # Error handling utilities
```

## Core Features

### 1. Plan Management

The application handles plans through a robust state management system using Zustand:

```typescript
interface PlanStore {
  user: User | null;
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: User) => void;
  fetchPlans: () => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  logout: () => void;
}
```

Implementation highlights:

* Efficient plan filtering and deduplication
* Type-safe operations
* Optimized state updates

### 2. Timeline Visualization

Timeline component (PlannedDate.tsx) provides:

```typescript
const TimelineComponent = () => {
  const { plans } = usePlanStore();
  
  const getEventDetails = (plan: any): EventDetails | null => {
    if (plan.place) {
      return {
        title: plan.place.placeName.title,
        description: plan.place.description,
        mainTag: plan.place.mainTag,
        subTags: plan.place.subTags,
        photos: plan.place.photos ?? [],
        eventCount: plan.place.photos?.length ?? 1
      };
    }
  };
};
```

Features:

* Month-based organization
* Event stacking
* Photo gallery integration
* Dynamic content scaling

### 3. Quick Plans System

Implemented in QuickPlanExpiration.tsx:

* Expiration-based grouping
* Visual alerts
* Batch operations

### 4. Navigation System

Using Expo Router with custom components:

```typescript
const PlanOptions = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleOptionPress = (option: string) => {
    if (option === 'Quick Plans') {
      router.push('/screens/quickplans');
    }
  };
};
```

## State Management

### Why Zustand?

1. Lightweight Bundle Size

```typescript
export const usePlanStore = create<PlanStore>((set) => ({
  user: null,
  plans: [],
  setUser: (user: User) => set({ user }),
  fetchPlans: async () => {
  }
}));

const { plans, fetchPlans } = usePlanStore();
```

2. TypeScript Excellence

* Built-in type inference
* No additional type packages needed

3. Performance Benefits

* Minimal re-renders
* Optimized for React Native
* Efficient updates

## Component Architecture

### 1. Screen Components

* Planner Screen (32.5% Plan / 72.5% Timeline split)
* Quick Plans Screen (Expiration-based layout)

### 2. Core Components

Modular design with focused responsibilities:

```typescript
const PlanCard = ({ title, events, image, onPress }: PlanCardProps) => (
  <TouchableOpacity style={styles.planCard} onPress={onPress}>
    <Image source={image} style={styles.planImage} />
    <View style={styles.planDetails}>
      <Text style={styles.planTitle}>{title}</Text>
      <IconGroup icons={events} />
    </View>
  </TouchableOpacity>
);
```

## Performance Optimizations

### 1. Component Level

* Strategic memoization
* Efficient re-rendering patterns
* Image optimization

### 2. Data Management

* Optimized filtering
* Deduplication strategies
* Type-safe implementations

## Technical Stack

* React Native 0.76
* Expo SDK 52
* TypeScript
* Expo Router
* Zustand

## Development Workflow

1. Clone repository
2. Install dependencies
3. Configure environment
4. Start development server

# Important Implementation Notes

## 1. Device & Architecture

* Implemented using Expo SDK 52 and React Native 0.76
* Leverages new bridgeless architecture
* Tested on iPhone 15 Pro Max
* Optimized for modern iOS aspect ratios and screen sizes
* Fully compatible with Expo Go for development

## 2. Plan & Event Management

### Plan Display Strategy

* Main view shows limited plans with "See More" option
* Plans ordered by expiration date (nearest to latest)
* Visual warning system for nearest expiring plan
* Clear differentiation between regular and quick plans

### Modal Implementation

* Comprehensive modal view for all plans
* Triggered by "See More" action
* Maintains consistent styling with main view
* Scrollable implementation for large plan sets

### User Interactions

* Intuitive deletion through direct plan press
* Event deletion triggered by long-pressing the event card
* Confirmation dialog prevents accidental deletions
* Consistent interaction pattern across all plan types
* Real-time state updates after deletion

## 2. Problem
Image seem to take too long to load
