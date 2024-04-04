import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, OctagonX, Search } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime"
import { IconButton } from "./icon-botton";
import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { TableRow } from "./table/table-row";
import { ChangeEvent, useEffect, useState } from "react";

// Formatador de datas relativas
dayjs.extend(relativeTime);
dayjs.locale('pt-br')

interface Attendee {
  id: string,
  name: string,
  email: string,
  createdAt: string,
  checkedInAt: string | null
}

export function AttendeeList() {

  // Estados
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([])

  const totalPages = Math.ceil(total / 10 )

  // aprendendo sobre o UseEffect
  useEffect(() => {

    const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')
    url.searchParams.set('pageIndex', String(page -1))

    if (search.length > 0 ){
      url.searchParams.set('query', search)
    }

    fetch(url)
    .then(response => response.json())
    .then( data => {
      setAttendees(data.attendees)
      setTotal(data.total)
    })
  }, [page, search]);

  // Funções
  const onSearchInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1)
  }

  const goToFirstPage = () => {
    setPage(1)
  }
  const goToPreviousPage = () => {
    setPage(page - 1)
  }
  const goToNextPage = () => {
    setPage(page + 1)
  }
  const goToLastPage = () => {
    setPage(totalPages)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="font-bold text-2xl">Participantes</h1>
        <div className="w-72 px-3 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
          <Search className="size-4 text-emerald-200" />
          <input onChange={onSearchInputChanged} className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0" type="text" placeholder="Buscar participante..." />
        </div>
      </div>

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 32 }}>
              <input className="rounded size-4 bg-black/20 border border-white/10" type="checkbox" />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data da inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            return (
              <TableRow key={attendee.id}>
                <TableCell>
                  <input className="rounded size-4 bg-black/20 border border-white/10" type="checkbox" />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">{attendee.name}</span>
                    <span>{attendee.email.toLocaleLowerCase()}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                <TableCell>{attendee.checkedInAt === null
                    ? <span className="text-zinc-400 inline-flex gap-1.5 items-center opacity-60">Não foi realizado <OctagonX size={20} className="text-rose-800" /> </span>
                    : dayjs().to(attendee.checkedInAt)}</TableCell>
                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando {attendees.length} de {total} itens
            </TableCell>
            <TableCell colSpan={3} className="text-right">
              <div className="inline-flex gap-8 items-center">
                <span>Pagina {page} de {totalPages}</span>
                <div className="flex gap-1.5">
                  <IconButton onClick={goToFirstPage} disabled={page === 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}