import { File, FileSchema } from '../schema/file.schema';

export const fileModel = { name: File.name, useFactory: () => FileSchema };
