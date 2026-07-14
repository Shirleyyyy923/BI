import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const submissions = sqliteTable("submissions", {
  id: text("id").primaryKey(),
  studentName: text("student_name").notNull(),
  school: text("school").notNull(),
  studentForm: text("student_form").notNull(),
  testLevel: text("test_level").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  percentage: integer("percentage").notNull(),
  band: text("band").notNull(),
  cefr: text("cefr").notNull(),
  placement: text("placement").notNull(),
  grammar: integer("grammar").notNull(),
  vocabulary: integer("vocabulary").notNull(),
  reading: integer("reading").notNull(),
  writing: integer("writing").notNull(),
  speaking: integer("speaking").notNull(),
  answersJson: text("answers_json").notNull(),
  submittedAt: text("submitted_at").notNull(),
});
