# Product Requirements Document (PRD): Airport Booking System

## 1. Document Overview
### 1.1 Purpose
This PRD outlines the requirements for developing an offline-first airport booking system designed to streamline inquiries, bookings, and operations for an airport concierge service. The system addresses current workflow fragmentation issues, where inquiries arrive via scattered channels (e.g., WhatsApp, Email) and are manually funneled into a Google Form. The new system replaces this with a centralized, reliable app that functions seamlessly offline, ensuring operational continuity in spotty internet environments like airports.

### 1.2 Scope
- **In Scope:** Unified intake of bookings from multiple sources, offline data entry and management, intelligent pre-filling, dashboards for operations, sync mechanisms, notifications, and basic integrations for email/WhatsApp.
- **Out of Scope:** Full CRM integration, payment processing, advanced analytics, or hardware procurement (e.g., tablets). These can be considered in future phases.

### 1.3 Version History
- Version 1.0: Initial draft based on provided scenario (December 16, 2025).
- Stakeholders: Airport concierge team, office managers, developers.

### 1.4 Assumptions and Dependencies
- Users have access to company tablets/laptops at the airport desk.
- Internet connectivity is intermittent but available periodically for syncing.
- Development team has expertise in offline-first technologies (e.g., PWA, React Native).
- Compliance with data privacy regulations (e.g., GDPR for personal data like passenger details).

## 2. Business Goals and Objectives
### 2.1 Problem Statement
Current processes rely on manual data transfer from WhatsApp/Email to Google Forms, leading to errors, delays, and inefficiency. Airport operations suffer from online dependency, with no reliable way to update bookings offline.

### 2.2 Objectives
- Centralize all booking intake into a single app as the "single point of truth."
- Enable full offline functionality for data entry, viewing, and task management.
- Reduce manual effort by 50-70% through auto-pre-filling and integrations.
- Improve operational efficiency with checklists, dashboards, and queued notifications.
- Ensure data syncs reliably when online, with conflict resolution.

### 2.3 Success Metrics
- 90% of bookings entered directly via the app within 3 months of launch.
- Reduction in booking errors (measured via user feedback) by 80%.
- App uptime offline: 100% for core features.
- Sync success rate: >95% on reconnection.

## 3. User Personas
| Persona | Description | Key Needs | Pain Points |
|---------|-------------|-----------|-------------|
| **Airport Concierge Staff** | Frontline workers at the airport desk handling inquiries and operations. Age 25-45, tech-savvy but in high-pressure environments. | Offline access to bookings, quick data entry, task checklists, photo attachments. | Spotty internet, manual copying from messages, no real-time updates. |
| **Office Manager** | Back-office admin handling confirmations, invoicing, and oversight. Age 30-50, uses desktops/laptops. | Real-time synced dashboards, search/filter tools, notification triggers. | Scattered data sources, delayed updates from airport team. |
| **Client (End-User)** | Passengers or companies booking services. Indirect users via confirmations. | Timely confirmations via email/SMS/WhatsApp. | Delayed responses due to manual processes. |

## 4. Functional Requirements
### 4.1 Unified Inbox
- Display a dashboard aggregating entries from manual input, emails (auto-parsed), and WhatsApp (API or manual paste).
- Support status tags: New, Contacted, Confirmed, In Progress, Completed, Cancelled.
- Allow filtering/sorting by source, date, or status.

### 4.2 Offline-First Data Entry
- Core booking form mirrors and enhances the existing Google Form.
- Immediate local save using a database (e.g., SQLite/IndexedDB).
- Visual indicator for online/syncing vs. offline status.
- Queue actions (e.g., notifications) for later execution.

### 4.3 Intelligent Pre-fill and Auto-Detection
- Parse text from Email/WhatsApp using simple NLP to extract: names, flight numbers (e.g., "UA 457"), dates, times.
- Auto-suggest client details from past bookings when entering phone/email.
- "Create from Text" button to paste message content and pre-fill ~60% of fields.

### 4.4 Enhanced Booking Form
- **Sections and Fields:**
  - Client: Full Name, Company/Private (toggle), Phone, Email, Preferred Contact Method (dropdown: Email, WhatsApp, SMS).
  - Flight: Airline (autocomplete), Flight Number, Date, Time, Terminal, Number of Pax.
  - Passenger List: Dynamic add/remove rows with fields for name, group label.
  - Services: Tap-to-select grid with icons (e.g., Meet & Greet, Fast Track, Lounge, Porter, Chauffeur).
  - Special Requests: Multi-line text box.
  - Attachments: Camera integration for photos (e.g., passport), file upload from device/email.
  - Internal Notes/Logs: Timestamped entries for team updates.
- Validation: Required fields highlighted, error messages for invalid data (e.g., future dates only).

### 4.5 Sync Engine
- On internet detection: Push local changes to cloud backend; pull remote updates.
- Conflict resolution: "Last edit wins" default; prompt for manual merge on critical fields (e.g., status).
- Support multi-device sync (e.g., airport tablet and office dashboard).

### 4.6 Dashboard and Operations View
- Day View: Timeline of bookings sorted by flight time, with color-coding by status.
- Checklist Mode: Per-booking tasks (e.g., Arrival Monitored, Met Passenger) with checkboxes.
- Search/Filter: By flight number, passenger name, status, date range.
- Export options: Generate PDF/CSV for invoices or reports (queued offline).

### 4.7 Notification and Confirmation Engine
- Auto-send templates (email/SMS/WhatsApp) on status change to "Confirmed."
- Queue unsent notifications offline; retry on reconnect.
- Customizable templates with placeholders (e.g., {PassengerName}, {FlightTime}).

### 4.8 Integrations
- Email: Forward to app-specific address for parsing; use Zapier/Make.com as bridge.
- WhatsApp: Business API for auto-ingestion; fallback to copy-paste.
- Future: API hooks for flight status (e.g., from external services like FlightAware).

## 5. Non-Functional Requirements
### 5.1 Performance
- App load time: <2 seconds offline.
- Sync time: <10 seconds for 50 bookings on standard WiFi.
- Handle up to 200 bookings per day without lag.

### 5.2 Security and Privacy
- Encrypt local data (e.g., passenger details).
- Authentication: Role-based (staff vs. manager) with PIN/biometrics.
- Data retention: Auto-purge completed bookings after 30 days (configurable).
- Compliance: GDPR-compliant for EU operations; no storage of sensitive data like full passport photos without consent.

### 5.3 Usability
- Intuitive UI: Mobile-first design for tablets, with large buttons for airport use.
- Accessibility: High contrast, screen reader support, multilingual (English default; add Spanish/Arabic later).
- Error Handling: Graceful offline fallbacks, user-friendly messages (e.g., "Saved locally—will sync soon").

### 5.4 Reliability
- Offline Availability: 100% for entry/viewing; 99% sync success.
- Backup: Daily local exports; cloud backups.

### 5.5 Scalability
- Support 5-10 concurrent users initially.
- Cloud backend scalable to 1,000 bookings/month.

## 6. Technical Stack
- **Frontend:** PWA (preferred for cross-device) or React Native/Flutter for native feel.
- **Local Storage:** IndexedDB (PWA) or SQLite (native).
- **Backend/Sync:** Supabase or Firebase for real-time DB, auth, and storage.
- **Parsing/NLP:** Built-in regex/simple libraries (e.g., date-fns for dates); no heavy ML initially.
- **Deployment:** Installable PWA on tablets; web dashboard for office.

## 7. UI/UX Considerations
- **Wireframe Outline:**
  - Home: Unified Inbox with tabs for New/Active/Archived.
  - Form: Stepper wizard for long forms; auto-save every 10 seconds.
  - Dashboard: Calendar integration for Day View; drag-and-drop for reordering tasks.
- **Themes:** Dark mode for low-light airport environments.
- **Testing:** User testing with mock offline scenarios.

## 8. Phased Rollout Plan
| Phase | Milestones | Timeline | Dependencies |
|-------|------------|----------|--------------|
| **Phase 1: MVP** | Build core form, offline entry, basic sync. | 4-6 weeks | Design approval. |
| **Phase 2: Integrations** | Add email/WhatsApp parsing, notifications. | 3-4 weeks | API access. |
| **Phase 3: Dashboards** | Implement operations views, checklists. | 2-3 weeks | Beta testing. |
| **Phase 4: Launch** | Full rollout, training, monitoring. | 2 weeks | User feedback. |

## 9. Risks and Mitigations
- **Risk:** Sync conflicts. **Mitigation:** Timestamp all edits; audit logs.
- **Risk:** Data loss offline. **Mitigation:** Redundant local backups.
- **Risk:** Adoption resistance. **Mitigation:** Training sessions; start with low-tech Google Forms improvements as bridge.

## 10. Appendix
- **Sample Data Model:**
  - Booking Entity: ID, ClientID, FlightDetails (JSON), Services (array), Status, Notes (array of {timestamp, text}).
  - Client Entity: ID, Name, Phone, Email, History (array of past BookingIDs).
- **Cost Estimates:** Development: $20K-50K (depending on stack); Ongoing: $100/month for cloud services.

This PRD provides a blueprint for development. If needed, we can refine sections like database schemas or add prototypes.
