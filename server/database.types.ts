export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          username: string
          passwordHash: string
          email: string | null
          isAdmin: boolean
        }
        Insert: {
          id?: number
          username: string
          passwordHash: string
          email?: string | null
          isAdmin?: boolean
        }
        Update: {
          id?: number
          username?: string
          passwordHash?: string
          email?: string | null
          isAdmin?: boolean
        }
      }
      races: {
        Row: {
          id: number
          name: string
          nameRo: string
          nameFr: string
          nameDe: string
          description: string
          descriptionRo: string
          descriptionFr: string
          descriptionDe: string
          distance: number
          elevation: number
          difficulty: string
          date: string
          price: number
          imageUrl: string | null
          raceMap: string | null
        }
        Insert: {
          id?: number
          name: string
          nameRo: string
          nameFr: string
          nameDe: string
          description: string
          descriptionRo: string
          descriptionFr: string
          descriptionDe: string
          distance: number
          elevation: number
          difficulty: string
          date: string
          price: number
          imageUrl?: string | null
          raceMap?: string | null
        }
        Update: {
          id?: number
          name?: string
          nameRo?: string
          nameFr?: string
          nameDe?: string
          description?: string
          descriptionRo?: string
          descriptionFr?: string
          descriptionDe?: string
          distance?: number
          elevation?: number
          difficulty?: string
          date?: string
          price?: number
          imageUrl?: string | null
          raceMap?: string | null
        }
      }
      participants: {
        Row: {
          id: number
          firstname: string
          lastname: string
          email: string
          phoneNumber: string
          country: string
          birthDate: string
          raceId: number
          bibNumber: string | null
          status: string
          medicalInfo: string | null
          registrationDate: string
          gender: string
          age: number
        }
        Insert: {
          id?: number
          firstname: string
          lastname: string
          email: string
          phoneNumber: string
          country: string
          birthDate: string
          raceId: number
          bibNumber?: string | null
          status?: string
          medicalInfo?: string | null
          registrationDate?: string
          gender: string
          age: number
        }
        Update: {
          id?: number
          firstname?: string
          lastname?: string
          email?: string
          phoneNumber?: string
          country?: string
          birthDate?: string
          raceId?: number
          bibNumber?: string | null
          status?: string
          medicalInfo?: string | null
          registrationDate?: string
          gender?: string
          age?: number
        }
      }
      contact_inquiries: {
        Row: {
          id: number
          name: string
          email: string
          subject: string
          message: string
          createdAt: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          subject: string
          message: string
          createdAt?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          subject?: string
          message?: string
          createdAt?: string
        }
      }
      faqs: {
        Row: {
          id: number
          question: string
          questionRo: string
          questionFr: string
          questionDe: string
          answer: string
          answerRo: string
          answerFr: string
          answerDe: string
          order_index: number
        }
        Insert: {
          id?: number
          question: string
          questionRo: string
          questionFr: string
          questionDe: string
          answer: string
          answerRo: string
          answerFr: string
          answerDe: string
          order_index: number
        }
        Update: {
          id?: number
          question?: string
          questionRo?: string
          questionFr?: string
          questionDe?: string
          answer?: string
          answerRo?: string
          answerFr?: string
          answerDe?: string
          order_index?: number
        }
      }
      program_events: {
        Row: {
          id: number
          date: string
          startTime: string
          endTime: string | null
          title: string
          titleRo: string
          titleFr: string
          titleDe: string
          description: string
          descriptionRo: string
          descriptionFr: string
          descriptionDe: string
          location: string
          order_index: number
        }
        Insert: {
          id?: number
          date: string
          startTime: string
          endTime?: string | null
          title: string
          titleRo: string
          titleFr: string
          titleDe: string
          description: string
          descriptionRo: string
          descriptionFr: string
          descriptionDe: string
          location: string
          order_index: number
        }
        Update: {
          id?: number
          date?: string
          startTime?: string
          endTime?: string | null
          title?: string
          titleRo?: string
          titleFr?: string
          titleDe?: string
          description?: string
          descriptionRo?: string
          descriptionFr?: string
          descriptionDe?: string
          location?: string
          order_index?: number
        }
      }
      sponsors: {
        Row: {
          id: number
          name: string
          description: string
          descriptionRo: string
          descriptionFr: string
          descriptionDe: string
          logoPlaceholder: string
          website: string
          level: string
          order_index: number
        }
        Insert: {
          id?: number
          name: string
          description: string
          descriptionRo: string
          descriptionFr: string
          descriptionDe: string
          logoPlaceholder: string
          website: string
          level: string
          order_index: number
        }
        Update: {
          id?: number
          name?: string
          description?: string
          descriptionRo?: string
          descriptionFr?: string
          descriptionDe?: string
          logoPlaceholder?: string
          website?: string
          level?: string
          order_index?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}