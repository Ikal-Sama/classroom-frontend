import { CreateButton } from "@/components/refine-ui/buttons/create"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Department } from "@/types"
import { useTable } from "@refinedev/react-table"
import { ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const DepartmentLists = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);


    const searchFilters = debouncedSearchQuery ? [
        { field: 'name', operator: 'contains' as const, value: debouncedSearchQuery }
    ] : [];

    const departmentTable = useTable<Department>({
        columns: useMemo<ColumnDef<Department>[]>(() => [
            {
                id: 'code',
                accessorKey: 'code',
                size: 100,
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 250,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => <span className="text-foreground font-medium">{getValue<string>()}</span>,
                filterFn: 'includesString'
            },
            {
                id: 'description',
                accessorKey: 'description',
                size: 400,
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => <span className="truncate line-clamp-2 text-muted-foreground">{getValue<string>()}</span>
            }

        ], []),
        refineCoreProps: {
            resource: 'departments',
            pagination: {
                pageSize: 10, mode: 'server'
            },
            filters: {
                permanent: [...searchFilters]
            },
            sorters: {
                initial: [
                    { field: 'id', order: 'desc' },
                ]
            }
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Departments</h1>
            <div className="intro-row">
                <p>Overview and management of academic departments.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />

                        <Input type="text"
                            placeholder="Search by name..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <CreateButton />
                    </div>
                </div>
            </div>

            <DataTable table={departmentTable} />
        </ListView>
    )
}

export default DepartmentLists;