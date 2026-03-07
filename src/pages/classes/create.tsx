import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { CreateView } from "@/components/refine-ui/views/create-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useBack, useList } from "@refinedev/core"
import { useForm } from "@refinedev/react-hook-form"
import { Controller } from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { classSchema } from "@/lib/schema"

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import UploadWidget from "@/components/upload-widget"
import { Subject, User } from "@/types"




const ClassesCreate = () => {
    const back = useBack()

    const form = useForm({
        resolver: zodResolver(classSchema),
        refineCoreProps: {
            resource: 'classes',
            action: 'create'
        }
    })

    const { refineCore: { onFinish }, handleSubmit, formState: { isSubmitting, errors }, control } = form

    const onSubmit = async (data: z.infer<typeof classSchema>) => {
        try {
            await onFinish(data)
        } catch (error) {
            console.log('Error creating new classes', error)
        }
    }

    const { query: subjectsQuery } = useList<Subject>({
        resource: 'subjects',
        pagination: {
            pageSize: 100
        }
    })

    const { query: teachersQuery } = useList<User>({
        resource: 'users',
        filters: [
            {
                field: 'role',
                operator: 'eq',
                value: 'teacher'
            },
        ],
        pagination: {
            pageSize: 100
        }
    })

    const subjects = subjectsQuery?.data?.data || [];
    const subjectsLoading = subjectsQuery.isLoading;

    const teachers = teachersQuery?.data?.data || [];
    const teachersLoading = teachersQuery.isLoading;

    const bannerPublicId = form.watch('bannerCldPubId');

    const setBannerImage = (file: any, field: any) => {
        if (file) {
            field.onChange(file.url)
            form.setValue('bannerCldPubId', file.publicId, {
                shouldValidate: true,
                shouldDirty: true
            })
        } else {
            field.onChange("");
            form.setValue('bannerCldPubId', '', {
                shouldValidate: true,
                shouldDirty: true
            })
        }
    }

    return (
        <CreateView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Create a Class</h1>
            <div className="intro-row">
                <p>Provide the required information below to add a class.</p>
                <Button onClick={back}>Go Back</Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">Fill out the form</CardTitle>
                    </CardHeader>

                    <Separator />
                    <CardContent className="">
                        <form id="form-rhf-demo" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <FieldGroup>
                                <Controller
                                    name="bannerUrl"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-title">
                                                Banner Image <span className="text-orange-600">*</span>
                                            </FieldLabel>
                                            <UploadWidget
                                                value={field.value ? { url: field.value, publicId: bannerPublicId ?? '' } : null}
                                                onChange={(file) => setBannerImage(file, field)}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                            {errors.bannerCldPubId && !errors.bannerUrl && (
                                                <p className="text-destructive text-sm">
                                                    {errors.bannerCldPubId.message?.toString()}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-title">
                                                Class Name <span className="text-orange-600">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-title"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Introduction to Biology - Section A"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}

                                        </Field>
                                    )}
                                />
                            </FieldGroup>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <FieldGroup>
                                    <Controller
                                        name="subjectId"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="form-rhf-demo-title">
                                                    Subject <span className="text-orange-600">*</span>
                                                </FieldLabel>
                                                <Select onValueChange={(value) => field.onChange(Number(value))}
                                                    value={field.value?.toString()}
                                                    disabled={subjectsLoading}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a subject" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {subjects.map((subject) => (
                                                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                                                {subject.name} ({subject.code})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                                <FieldGroup>
                                    <Controller
                                        name="teacherId"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="teacher-select">
                                                    Assigned Teacher <span className="text-orange-600">*</span>
                                                </FieldLabel>
                                                <Select onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={teachersLoading}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a teacher" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {teachers.map((teacher) => (
                                                            <SelectItem key={teacher.id} value={teacher.id}>
                                                                {teacher.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <FieldGroup>
                                    <Controller
                                        name="capacity"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="capacity">
                                                    Capacity <span className="text-orange-600">*</span>
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    id="capacity"
                                                    placeholder="e.g. 30"
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                                        name="status"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="status">
                                                    Status <span className="text-orange-600">*</span>
                                                </FieldLabel>
                                                <Select onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                                            <FieldLabel htmlFor="description">
                                                Description <span className="text-orange-600">*</span>
                                            </FieldLabel>
                                            <Textarea
                                                {...field}
                                                id="description"
                                                placeholder="Enter class description..."
                                                className="min-h-[100px]"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>

                            <Button type="submit" className="w-full">Create Class</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    )
}

export default ClassesCreate