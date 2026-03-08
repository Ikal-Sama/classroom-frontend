import { CreateButton } from "@/components/refine-ui/buttons/create"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClassDetails } from "@/types"
import { useTable } from "@refinedev/react-table"
import { ColumnDef } from "@tanstack/react-table"
import { Search, User as UserIcon, Image as ImageIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelect } from "@refinedev/core"
import { ShowButton } from "@/components/refine-ui/buttons/show"

const ClassesList = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [selectedTeacher, setSelectedTeacher] = useState('all');
    const [selectedSubject, setSelectedSubject] = useState('all');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const teacherFilters = selectedTeacher === 'all' ? [] : [
        { field: 'teacher', operator: 'eq' as const, value: selectedTeacher }
    ];
    const subjectFilters = selectedSubject === 'all' ? [] : [
        { field: 'subject', operator: 'eq' as const, value: selectedSubject }
    ];
    const searchFilters = debouncedSearchQuery ? [
        { field: 'name', operator: 'contains' as const, value: debouncedSearchQuery }
    ] : [];

    const { options: teacherOptions } = useSelect({
        resource: "users",
        optionLabel: "name",
        optionValue: "id",
        filters: [
            {
                field: "role",
                operator: "eq",
                value: "teacher",
            },
        ],
    });

    const { options: subjectOptions } = useSelect({
        resource: "subjects",
        optionLabel: "name",
        optionValue: "id",
    });

    const classesTable = useTable<ClassDetails>({
        columns: useMemo<ColumnDef<ClassDetails>[]>(() => [
            {
                id: 'name',
                accessorKey: 'name',
                size: 250,
                header: () => <p className="column-title ml-2">Class Name</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-3 ml-2">
                        <div className="h-10 w-16 overflow-hidden rounded-md border bg-muted flex items-center justify-center shrink-0">
                            {row.original.bannerUrl ? (
                                <img
                                    src={row.original.bannerUrl}
                                    alt={row.original.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground">{row.original.name}</span>
                            <span className="text-xs text-muted-foreground">{row.original.inviteCode}</span>
                        </div>
                    </div>
                )
            },
            {
                id: 'subject',
                accessorKey: 'subject.name',
                size: 200,
                header: () => <p className="column-title">Subject</p>,
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="text-foreground">{row.original.subject?.name}</span>
                        <Badge variant="outline" className="w-fit scale-75 origin-left">
                            {row.original.subject?.code}
                        </Badge>
                    </div>
                )
            },
            {
                id: 'teacher',
                accessorKey: 'teacher.name',
                size: 200,
                header: () => <p className="column-title">Teacher</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={row.original.teacher?.image} />
                            <AvatarFallback>
                                <UserIcon className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground">{row.original.teacher?.name}</span>
                    </div>
                )
            },
            {
                id: 'capacity',
                accessorKey: 'capacity',
                size: 100,
                header: () => <p className="column-title">Capacity</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<number>()} Students</span>
                )
            },
            {
                id: 'status',
                accessorKey: 'status',
                size: 100,
                header: () => <p className="column-title">Status</p>,
                cell: ({ getValue }) => {
                    const status = getValue<string>();
                    return (
                        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    )
                }
            },
            {
                id: 'details',
                size: 140,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => <ShowButton resource="classes" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
            }

        ], []),

        refineCoreProps: {
            resource: 'classes',
            pagination: {
                pageSize: 10, mode: 'server'
            },
            filters: {
                permanent: [...teacherFilters, ...subjectFilters, ...searchFilters]
            },
            sorters: {
                initial: [
                    { field: 'createdAt', order: 'desc' },
                ]
            }
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Classes</h1>
            <div className="intro-row">
                <p>Manage your classes, subjects, and teacher assignments.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />

                        <Input type="text"
                            placeholder="Search by name, code, subject or teacher..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Teachers" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Teachers</SelectItem>
                                {teacherOptions.map(option => (
                                    <SelectItem key={option.value} value={String(option.value)}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Subjects" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjectOptions.map(option => (
                                    <SelectItem key={option.value} value={String(option.value)}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <CreateButton />
                    </div>
                </div>
            </div>

            <DataTable table={classesTable} />
        </ListView>
    )
}

export default ClassesList

