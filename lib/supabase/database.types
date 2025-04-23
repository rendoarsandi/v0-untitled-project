export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: string
          progress: number
          client_id: string
          created_at: string
          updated_at: string
          github_repo: string | null
          payment_status: string
          start_date: string | null
          estimated_completion: string | null
          last_update: string
          github_connected: boolean
          github_default_branch: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: string
          progress?: number
          client_id: string
          created_at?: string
          updated_at?: string
          github_repo?: string | null
          payment_status?: string
          start_date?: string | null
          estimated_completion?: string | null
          last_update?: string
          github_connected?: boolean
          github_default_branch?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: string
          progress?: number
          client_id?: string
          created_at?: string
          updated_at?: string
          github_repo?: string | null
          payment_status?: string
          start_date?: string | null
          estimated_completion?: string | null
          last_update?: string
          github_connected?: boolean
          github_default_branch?: string | null
        }
      }
      github_tokens: {
        Row: {
          id: string
          user_id: string
          access_token: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          access_token: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          project_id: string
          amount: number
          includes: string[]
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          amount: number
          includes: string[]
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          amount?: number
          includes?: string[]
          created_at?: string
        }
      }
      project_updates: {
        Row: {
          id: string
          project_id: string
          message: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          message: string
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          message?: string
          date?: string
          created_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          project_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          message?: string
          created_at?: string
        }
      }
      project_milestones: {
        Row: {
          id: string
          project_id: string
          name: string
          date: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          date: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          date?: string
          completed?: boolean
          created_at?: string
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

export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type NewProject = Database["public"]["Tables"]["projects"]["Insert"]
export type UpdateProject = Database["public"]["Tables"]["projects"]["Update"]

export type GitHubToken = Database["public"]["Tables"]["github_tokens"]["Row"]
export type NewGitHubToken = Database["public"]["Tables"]["github_tokens"]["Insert"]
export type UpdateGitHubToken = Database["public"]["Tables"]["github_tokens"]["Update"]

export type Quote = Database["public"]["Tables"]["quotes"]["Row"]
export type NewQuote = Database["public"]["Tables"]["quotes"]["Insert"]
export type UpdateQuote = Database["public"]["Tables"]["quotes"]["Update"]

export type ProjectUpdate = Database["public"]["Tables"]["project_updates"]["Row"]
export type NewProjectUpdate = Database["public"]["Tables"]["project_updates"]["Insert"]
export type UpdateProjectUpdate = Database["public"]["Tables"]["project_updates"]["Update"]

export type Feedback = Database["public"]["Tables"]["feedback"]["Row"]
export type NewFeedback = Database["public"]["Tables"]["feedback"]["Insert"]
export type UpdateFeedback = Database["public"]["Tables"]["feedback"]["Update"]

export type ProjectMilestone = Database["public"]["Tables"]["project_milestones"]["Row"]
export type NewProjectMilestone = Database["public"]["Tables"]["project_milestones"]["Insert"]
export type UpdateProjectMilestone = Database["public"]["Tables"]["project_milestones"]["Update"]
