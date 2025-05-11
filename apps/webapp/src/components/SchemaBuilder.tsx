import React, { useState } from 'react';
import { cn } from '../utils/cn';
import { z } from 'zod';

interface Field {
    name: string;
    type: string;
    required: boolean;
    description?: string;
}

interface SchemaBuilderProps {
    onSchemaChange?: (schema: Field[]) => void;
    className?: string;
}

export function SchemaBuilder({ onSchemaChange, className }: SchemaBuilderProps) {
    const [fields, setFields] = useState<Field[]>([]);
    const [currentField, setCurrentField] = useState<Field>({
        name: '',
        type: 'string',
        required: true,
    });

    const fieldTypes = [
        'string',
        'number',
        'boolean',
        'date',
        'array',
        'object',
        'enum',
    ] as const;

    const addField = () => {
        if (currentField.name) {
            setFields([...fields, currentField]);
            setCurrentField({
                name: '',
                type: 'string',
                required: true,
            });
            onSchemaChange?.([...fields, currentField]);
        }
    };

    const removeField = (index: number) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
        onSchemaChange?.(newFields);
    };

    const generateZodSchema = () => {
        return fields.map((field) => {
            const baseType = `z.${field.type}()`;
            const required = field.required ? '' : '.optional()';
            const description = field.description ? `.describe("${field.description}")` : '';
            return `${field.name}: ${baseType}${required}${description},`;
        }).join('\n  ');
    };

    const generateTRPCRoute = () => {
        const inputSchema = `const inputSchema = z.object({\n${generateZodSchema()}\n});`;
        return `
export const yourRoute = protectedProcedure
  .input(inputSchema)
  .mutation(async ({ ctx, input }) => {
    // Your implementation here
    return {
      success: true,
      data: input
    };
  });`;
    };

    return (
        <div className={cn("space-y-4 p-4 border rounded-lg bg-white shadow-sm", className)}>
            <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-semibold">Schema Builder</h3>
                <div className="flex flex-wrap gap-2">
                    <input
                        type="text"
                        placeholder="Field name"
                        className="px-2 py-1 border rounded flex-1 min-w-[200px]"
                        value={currentField.name}
                        onChange={(e) => setCurrentField({ ...currentField, name: e.target.value })}
                    />
                    <select
                        className="px-2 py-1 border rounded flex-1 min-w-[150px]"
                        value={currentField.type}
                        onChange={(e) => setCurrentField({ ...currentField, type: e.target.value as typeof fieldTypes[number] })}
                    >
                        {fieldTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <label className="flex items-center space-x-2 min-w-[100px]">
                        <input
                            type="checkbox"
                            checked={currentField.required}
                            onChange={(e) => setCurrentField({ ...currentField, required: e.target.checked })}
                            className="rounded border-gray-300"
                        />
                        <span>Required</span>
                    </label>
                    <button
                        onClick={addField}
                        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!currentField.name}
                    >
                        Add Field
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {fields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded group">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">{field.name}</span>
                            <span className="text-gray-500">{field.type}</span>
                            {field.required && <span className="text-red-500">*</span>}
                        </div>
                        <button
                            onClick={() => removeField(index)}
                            className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {fields.length > 0 && (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Zod Schema</h4>
                        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                            <code className="text-sm">{`const schema = z.object({\n${generateZodSchema()}\n});`}</code>
                        </pre>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">tRPC Route</h4>
                        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                            <code className="text-sm">{generateTRPCRoute()}</code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
} 