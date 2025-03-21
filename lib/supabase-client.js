// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cxamnsffehixcmcvwwbv.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YW1uc2ZmZWhpeGNtY3Z3d2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MTc2ODYsImV4cCI6MjA1ODA5MzY4Nn0.Vr27oBVsNe-BaquXkua8ehxxug2VMub4jxq9pp4sPaE';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

// テーブル構造（Supabaseで作成する必要あり）
/*
rooms:
  id: uuid primary key
  name: text
  created_at: timestamp with time zone
  max_players: integer
  game_state: jsonb

players:
  id: uuid primary key
  room_id: uuid references rooms(id)
  name: text
  chips: integer
  hand: jsonb
  is_active: boolean
  created_at: timestamp with time zone
