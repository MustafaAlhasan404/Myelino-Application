# Comprehensive Technical Documentation: Myelino Application

## I. Service Layer

### A. Plan Service (planService.ts)

* Clean API client interface using axios
* Core Methods:
  * `getAll()`: Plan retrieval
  * `deleteEvent(eventId)`: Event removal
  * `deletePlans(planIds[])`: Batch deletion
  * `clearPlanner()`: Complete data wipe
  * `loadMockData()`: Test data loading

### B. Plan Store (planStore.ts)

* Zustand-based state management
* Data Models:

  ```typescript
  User {
    id: string
    email: string
    name: string
  }
  Plan {
    _id: string
    plan: string
    userId: string
    date: string
    place?: PlaceDetails
    myelin?: MyelinDetails
  }
  ```
* Features:

  * State Management (user data, plans, loading states)
  * Core Functions (setUser, fetchPlans, deletePlan, logout)
  * Data Processing (filtering, tracking, event separation)

## II. Screen Components

### A. Planner Screen (planner.tsx)

* Main dashboard layout
* Sections:
  * Plan section (32.5%) [ Plan.tsx ]
  * Timeline section (72.5%) [ PlannedDate.tsx ]
* Safe area implementation
* Memoized components

### B. Quick Plans Screen (quickplans.tsx)

* Expiration-based organization
* Custom header navigation
* Integration with PlanOptions

## III. UI Components

### A. Plan Components

1. Plan.tsx
   * Horizontal scrollable cards
   * Expiration alerts
   * Modal view implementation for showcasing all plans
2. PlannedDate.tsx
   * Timeline visualization
   * Event stacking
   * Month-based organization

### B. Navigation Components

1. Scroll.tsx (PlanOptions)
   * Horizontal navigation
   * Route-aware styling
   * Active state management

### C. Input Components

1. CustomInput.tsx
   * Email/password handling
   * Icon integration
   * Visibility controls

### D. Quick Plan Components

1. QuickPlanExpiration.tsx
   * Expiration grouping
   * Delete confirmation
   * Activity indicators

## IV. Technical Stack

* React Native 0.76
* Expo SDK 52

Note : Used latest version of expo and react native to use new architecture of bridgeless mode as you can find in app.json and so that i can run the code on my own ios device

* TypeScript
* Expo Router
* Zustand State Management

# Why Zustand for State Management

### Implementation Simplicity

```typescript
export const usePlanStore = create<PlanStore>((set) => ({
  user: null,
  plans: [],
  setUser: (user: User) => set({ user }),
  fetchPlans: async () => {
    // Simple async logic
  }
}));
```

### Direct Component Usage

```typescript
const { plans, fetchPlans } = usePlanStore();
```

### TypeScript Excellence

* Built-in type inference
* No extra type packages needed
* Perfect fit with our existing TypeScript setup

### Mobile-First Benefits

* Lightweight bundle size
* Efficient re-rendering
* Optimized for React Native performance

## Development Speed

* Quick setup
* Fast iterations
* Clear debugging

The implementation in `planStore.ts` demonstrates how we manage complex state with minimal code while maintaining full type safety - making Zustand the ideal choice for this React Native project.
