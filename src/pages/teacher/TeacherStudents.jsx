import { useMemo } from 'react'
import { Users } from 'lucide-react'
import StudentListing from '../../components/student/StudentListing'
import {
  SquiggleUnderline, Crayon, Rainbow, Balloon, ABCBlock, Star as StarDoodle, SolidShape, Kid,
} from '../../components/illustrations/Doodles'
import { useAuth } from '../../context/AuthContext'
import { useReviews } from '../../context/ReviewContext'

export default function TeacherStudents() {
  const { user } = useAuth()
  const { students, loading, error, reloadStudents } = useReviews()
  const teacher = user?.teacher
  const myStudents = useMemo(
    () => students.filter((s) => !teacher?.id || s.teacherId === teacher.id),
    [students, teacher],
  )

  return (
    <div className="relative space-y-6">
      {/* Kids reading — pinned to the viewport (not the page), so it stays
          put in the left margin while the page/list scrolls past it.
          Softly faded at the edges so there's no visible photo rectangle.
          Only shown once the viewport is wide enough to have real margin
          there. Matches the same watermark on the Dashboard page. */}
      <div
        className="hidden xl:block fixed -left-12 top-3/4 -translate-y-1/2 w-72 h-72 2xl:w-96 2xl:h-96 opacity-50 pointer-events-none"
        style={{
          backgroundImage: "url('/images/kids-watermark.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          maskImage: 'radial-gradient(ellipse 62% 62% at 50% 42%, black 45%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(ellipse 62% 62% at 50% 42%, black 45%, transparent 82%)',
        }}
        aria-hidden="true"
      />

      {/* Themed doodles + solid shapes scattered in the wide side margins */}
      <Rainbow className="w-24 h-14 top-0 -left-28 hidden xl:block opacity-90" delay={0.2} />
      <Kid className="w-16 h-24 top-28 -left-16 hidden xl:block" color="#22A3F5" delay={0.1} />
      <StarDoodle className="w-6 h-6 top-[15rem] -left-24 hidden xl:block" color="#FFBE22" delay={0.8} />
      <Crayon className="w-7 h-20 top-[19rem] -left-20 hidden xl:block" color="#FA5411" delay={0.5} />
      <SolidShape shape="circle" className="w-10 h-10 top-[26rem] -left-24 hidden xl:block opacity-70" color="#43CD82" delay={0.3} />

      <Balloon className="w-9 h-16 top-4 -right-24 hidden xl:block" color="#FF7539" delay={0.4} />
      <ABCBlock className="w-9 h-9 top-40 -right-20 hidden xl:block" letter="S" color="#22B566" delay={0.7} />
      <SolidShape shape="square" className="w-9 h-9 top-72 -right-16 hidden xl:block opacity-70" color="#FFBE22" delay={0.6} />
      <SolidShape shape="triangle" className="top-[26rem] -right-24 hidden xl:block opacity-80" color="#22A3F5" delay={0.9} />
      <StarDoodle className="w-6 h-6 top-[32rem] -right-20 hidden xl:block" color="#22B566" />
      <ABCBlock className="w-8 h-8 top-[38rem] -left-20 hidden xl:block" letter="T" color="#FA5411" />
      <SolidShape shape="circle" className="w-8 h-8 top-[44rem] -right-24 hidden xl:block opacity-70" color="#FF9C6E" />
      <Crayon className="w-6 h-16 top-[50rem] -right-16 hidden xl:block" color="#22A3F5" />

      <div className="relative flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-soft shrink-0">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-sky-900">My Students</h1>
          <SquiggleUnderline className="w-24 h-2.5 -mt-0.5 mb-0.5" color="#43CD82" />
          <p className="text-sky-800/60 text-sm">Search, filter and review students across all your classes.</p>
        </div>
      </div>
      {loading ? (
        <p className="text-sky-800/60 text-sm py-10 text-center">Loading students from school registry…</p>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <button type="button" onClick={reloadStudents} className="text-sm font-semibold text-sky-600 hover:underline">
            Retry
          </button>
        </div>
      ) : (
        <StudentListing
          students={myStudents}
          basePath="/teacher/students"
          classesAssigned={teacher?.classesAssigned || []}
        />
      )}
    </div>
  )
}
