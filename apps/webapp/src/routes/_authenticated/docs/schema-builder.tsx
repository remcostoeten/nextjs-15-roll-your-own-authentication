import { createFileRoute } from '@tanstack/react-router'
import { ThemeToggle } from '@acme/ui/theme'
import { SchemaBuilder } from '../../../components/SchemaBuilder'

function SchemaBuilderPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Interactive Schema Builder</h1>
                <ThemeToggle />
            </div>

            <section className="prose max-w-none mb-8">
                <h2>Getting Started</h2>
                <p>
                    Welcome to the Interactive Schema Builder! This tool helps you create Zod schemas and tRPC routes
                    visually. Simply add fields, specify their types, and see the generated code in real-time.
                </p>

                <h3>How to Use</h3>
                <ol>
                    <li>Enter a field name in the input box</li>
                    <li>Select the field type from the dropdown</li>
                    <li>Choose whether the field is required</li>
                    <li>Click "Add Field" to add it to your schema</li>
                    <li>Repeat for all needed fields</li>
                    <li>Copy the generated Zod schema and tRPC route code</li>
                </ol>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                    <p className="text-yellow-700">
                        <strong>Tip:</strong> Start with the most important fields first. You can always remove fields
                        if needed.
                    </p>
                </div>
            </section>

            <SchemaBuilder className="mb-8" />

            <section className="prose max-w-none">
                <h2>Understanding the Generated Code</h2>

                <h3>Zod Schema</h3>
                <p>
                    The generated Zod schema defines the shape and validation rules for your data. Each field
                    is typed according to your selection, with optional fields marked appropriately.
                </p>

                <h3>tRPC Route</h3>
                <p>
                    The tRPC route shows how to implement an endpoint using your schema. It includes:
                </p>
                <ul>
                    <li>Input validation using your Zod schema</li>
                    <li>A protected procedure (requiring authentication)</li>
                    <li>Basic success response structure</li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                    <p className="text-blue-700">
                        <strong>Note:</strong> Remember to customize the generated route name and implementation
                        according to your specific needs.
                    </p>
                </div>

                <h2>Best Practices</h2>
                <ul>
                    <li>Use descriptive field names that reflect their purpose</li>
                    <li>Consider making fields optional if they aren't always required</li>
                    <li>Group related fields together when building your schema</li>
                    <li>Add validation rules as needed after copying the base schema</li>
                </ul>
            </section>
        </div>
    )
}

export const Route = createFileRoute('/_authenticated/docs/schema-builder')({
    component: SchemaBuilderPage
}) 