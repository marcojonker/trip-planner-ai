import { z } from 'zod';

export const pointGeometrySchema = z.object({
  type: z.literal('Point'),
  coordinates: z.array(z.number()).length(2),
});

export const taskSchema = z.object({
  task: z.string(),
  name: z.string(),
  street: z.string(),
  houseNumber: z.number(),
  city: z.string(),
  country: z.string(),
  distance: z.number(),
  reason: z.string(),
  openingHours: z.array(z.string()),
  alternativeName: z.string(),
  alternativeStreet: z.string(),
  alternativeHouseNumber: z.number(),
  alternativeCity: z.string(),
  alternativeCountry: z.string(),
  alternativeAddress: z.string(),
  alternativeGeometry: pointGeometrySchema,
  alternativeDistance: z.number(),
  alternativeReason: z.string(),
});

export const taskFeatureSchema = z.object({
  type: z.literal('Feature'),
  geometry: pointGeometrySchema,
  properties: taskSchema,
});

export const taskFeatureCollectionSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(taskFeatureSchema)

});
