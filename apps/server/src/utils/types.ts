/**
 * Map the prisma schema with the corresponding
 * type definitions for controller management
 */

// ENUMERATION TYPES

export type Role = "USER" | "LEAD" | "ADMIN" | "SUBHEAD" | "MEMBER";

export type EventType = "WORKSHOP" | "HACKATHON";

export type EntryType = "REGISTERED" | "WALKIN";

export type Attendance = "PRESENT" | "ABSENT";

export type Socials = "INSTAGRAM" | "LINKEDIN" | "DISCORD" | "COMMUDLE";

// Legacy alias for backward compatibility
export type EventCategory = "MEMBER_ONLY" | "PUBLIC" | EventType;

// MODEL INTERFACES

/**
 * User interface - for user creation
 * Required: email (unique identifier)
 * Optional: all other fields have defaults or are optional
 */
export interface User {
  email: string;
  name?: string;
  rollnumber?: string;
  password?: string;
  role?: Role; // defaults to USER
}

/**
 * Team interface - for team creation
 * Required: name (essential for team identification)
 * Optional: description
 */
export interface Team {
  name: string;
  description?: string;
}

/**
 * Team Member interface - for team member creation
 * Required: userId and teamId (both essential for the relationship)
 */
export interface TeamMember {
  userId: string;
  teamId: string;
}

/**
 * Event interface - for event creation
 * Required: all fields are essential for event creation except relations
 */
export interface Event {
  name: string;
  tagline: string;
  eventStartDate: Date;
  eventEndDate: Date;
  eventCategory: EventType;
  eventPoster: string;
  createdBy: string;
}

/**
 * Event Participant interface - for event participant creation
 * Required: userId, eventId, isPresent, entryType (all essential for participation tracking)
 */
export interface EventParticipant {
  userId: string;
  eventId: string;
  isPresent?: Attendance;
  entryType: EntryType;
}

/**
 * Event Calendar interface - for event calendar creation
 * Required: eventDate, title, description, eventId (all essential for calendar entry)
 */
export interface EventCalendar {
  eventDate: Date;
  title: string;
  description: string;
  markeed: boolean;
  eventId: string;
  eventType: EventCategory;
}

/**
 * Event Documentation interface - for event documentation creation
 * Required: name, title, content, externalRef, eventId (all essential for documentation)
 */
export interface EventDocumentation {
  name: string;
  title: string;
  content: string;
  externalRef: string;
  eventId: string;
}

/**
  -Event Post interface - for event post creation
  -Required: name, platform, externalRef, postScheduleDate, eventId (all essential for social media post)
 */
export interface EventPost {
  name: string;
  platform: Socials;
  externalRef: string;
  postScheduleDate: Date;
  eventId: string;
}

// RESPONSE INTERFACES (for API responses)

/**
 * Complete interfaces including auto-generated fields (for API responses)
 */

export interface UserResponse extends User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamResponse extends Team {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMemberResponse extends TeamMember {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventResponse extends Event {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventParticipantResponse extends EventParticipant {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCalendarResponse extends EventCalendar {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventDocumentationResponse extends EventDocumentation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventPostResponse extends EventPost {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// SCHEDULER DOMAIN TYPES

export type ScheduleStatus = "DRAFT" | "SCHEDULED" | "CANCELLED";
export interface PostSchedule {
  id: string;
  postId: string;
  scheduledAt: Date;
  timezone: string;
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ReminderType = "EMAIL" | "IN_APP";
export type ReminderOffset =
  | "15_MIN"
  | "30_MIN"
  | "1_HOUR"
  | "1_DAY";

export interface Reminder {
  id: string;
  scheduleId: string;
  type: ReminderType;
  offset: ReminderOffset;
  triggerAt: Date;
  sent: boolean; 
  createdAt: Date;
}

