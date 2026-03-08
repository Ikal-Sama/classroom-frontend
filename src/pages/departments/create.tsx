import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useForm } from "@refinedev/react-hook-form"
import { Controller } from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { departmentSchema } from "@/lib/schema"

const DepartmentCreate = () => {
    const form = useForm({
        resolver: zodResolver(departmentSchema),
        refineCoreProps: {
            resource: 'departments',
            action: 'create',
            redirect: 'list'
        }
    })

    const { refineCore: { onFinish }, handleSubmit, formState: { isSubmitting }, control } = form

    const onSubmit = async (data: z.infer<typeof departmentSchema>) => {
        try {
            await onFinish(data)
        } catch (error) {
            console.log('Error creating new department', error)
        }
    }

    return (
        <CreateView className="department-view">
            <CreateViewHeader title="Create Department" resource="departments" />

            <div className="my-4 flex items-center">
                <Card className="max-w-2xl w-full mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Department Details</CardTitle>
                        <p className="text-sm text-muted-foreground">Provide the required information below to add a new academic department.</p>
                    </CardHeader>

                    <Separator />
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FieldGroup>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel>
                                                    Department Name <span className="text-orange-600">*</span>
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g. Computer Science"
                                                    autoComplete="off"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>

                                <FieldGroup>
                                    <Controller
                                        name="code"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel>
                                                    Department Code <span className="text-orange-600">*</span>
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g. CS"
                                                    autoComplete="off"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </div>

                            <FieldGroup>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                Description
                                            </FieldLabel>
                                            <Textarea
                                                {...field}
                                                placeholder="Enter department description..."
                                                className="min-h-[100px]"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Department"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    )
}

export default DepartmentCreate