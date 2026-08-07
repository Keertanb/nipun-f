import { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users, CheckCircle2, Clock, School, MapPin } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import StudentListing from '../../components/student/StudentListing'
import {
  Star as StarDoodle,
  Balloon,
  ABCBlock,
  SolidShape,
  ConfettiDots,
  Kid,
  Crayon,
  Rainbow,
} from '../../components/illustrations/Doodles'
import { useAuth } from '../../context/AuthContext'
import { useReviews } from '../../context/ReviewContext'
import { useLanguage } from '../../context/LanguageContext'
import TeacherStagePanel from '../../components/teacher/TeacherStagePanel'

const kidsWatermarkStyle = {
  backgroundImage: "url('/images/kids-watermark.png')",
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  maskImage: 'radial-gradient(ellipse 62% 62% at 50% 42%, black 45%, transparent 82%)',
  WebkitMaskImage: 'radial-gradient(ellipse 62% 62% at 50% 42%, black 45%, transparent 82%)',
}

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { students, loading, error, reloadStudents } = useReviews()
  const { t } = useLanguage()
  const teacher = user?.teacher

  const myStudents = useMemo(
    () => students.filter((s) => !teacher?.id || s.teacherId === teacher.id),
    [students, teacher],
  )

  const stats = useMemo(() => {
    const completed = myStudents.filter((s) => s.status === 'Completed').length
    return {
      total: myStudents.length,
      completed,
      pending: myStudents.length - completed,
    }
  }, [myStudents])

  const handleRetry = useCallback(() => {
    reloadStudents({ withWorkspace: true })
  }, [reloadStudents])

  if (!teacher) return null

  return (
    <div className="relative">
      {/* Kids watermark in the left margin behind class cards */}
      <div
        className="hidden xl:block fixed -left-12 top-[72%] -translate-y-1/2 w-72 h-72 2xl:w-96 2xl:h-96 opacity-50 pointer-events-none z-0"
        style={kidsWatermarkStyle}
        aria-hidden="true"
      />

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <ConfettiDots />
        <StarDoodle className="w-6 h-6 top-2 right-[18%] hidden md:block" color="#FFBE22" delay={0.3} />
        <ABCBlock className="w-8 h-8 top-[26rem] right-4 hidden lg:block" letter="B" color="#22B566" delay={0.7} />
        <Balloon className="w-8 h-14 top-[10rem] right-10 hidden xl:block" color="#22A3F5" delay={1} />
        <SolidShape shape="triangle" className="top-[34rem] left-1/2 hidden lg:block" color="#FFBE22" delay={0.5} />
        <SolidShape shape="circle" className="w-10 h-10 top-[6rem] left-[14%] hidden md:block" color="#FF9C6E" delay={0.9} />
        <Kid className="w-10 h-16 top-[3rem] left-2 hidden lg:block" color="#43CD82" delay={0.4} />
        <Kid className="w-9 h-14 top-[44rem] right-6 hidden lg:block" color="#FF9C6E" delay={0.8} />
        <ABCBlock className="w-7 h-7 top-[52rem] left-[10%] hidden md:block" letter="D" color="#F9A007" delay={1.1} />
        <StarDoodle className="w-5 h-5 top-[48rem] left-1/2 hidden lg:block" color="#22A3F5" delay={0.6} />
        <Crayon className="w-6 h-16 top-[16rem] right-8 hidden xl:block" color="#FA5411" />
        <Rainbow className="w-20 h-12 top-[60rem] right-10 hidden lg:block opacity-90" />
        <SolidShape shape="square" className="w-8 h-8 top-[68rem] left-[8%] hidden md:block opacity-70" color="#22A3F5" />
        <StarDoodle className="w-5 h-5 top-[20rem] left-[6%] hidden md:block" color="#FF7539" />
        <ABCBlock className="w-7 h-7 top-[76rem] right-[12%] hidden lg:block" letter="E" color="#169153" />
        <SolidShape shape="circle" className="w-6 h-6 top-[56rem] right-[20%] hidden xl:block opacity-70" color="#FFBE22" />
      </div>

      <div className="relative z-[1] space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-50 rounded-xl3 shadow-soft border border-sky-100"
        >
          <div className="relative z-10 flex items-start sm:items-center gap-5 p-6 sm:p-8 md:pr-[44%]">
            <div className="flex-1">
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-sky-900">{teacher.name}</h1>
              <p className="text-sky-800/60 text-sm mt-0.5">
                {t('teacherId')}: {teacher.teacherId} &middot; {t('schoolCode')}: {teacher.schoolCode}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm font-semibold text-sky-800">
                <span className="flex items-center gap-1.5">
                  <School className="w-4 h-4 text-sky-500" /> {teacher.schoolName}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-500" /> {teacher.district} &middot; {teacher.block} &middot;{' '}
                  {teacher.cluster}
                </span>
              </div>
              <p className="text-sky-800/50 text-xs mt-1">
                {t('village')}: {teacher.village}
              </p>
            </div>
          </div>

          <div className="hidden md:block absolute inset-y-0 right-0 w-[44%] overflow-hidden">
            <img src="/images/school-banner.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-sky-50 to-transparent" />
          </div>

          <div className="md:hidden relative h-32 sm:h-40 overflow-hidden">
            <img src="/images/school-banner.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-sky-50/70 to-transparent" />
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Users} label={t('totalStudents')} value={loading ? '…' : stats.total} theme="sky" delay={0} />
          <StatCard
            icon={CheckCircle2}
            label={t('completedReviewsStat')}
            value={loading ? '…' : stats.completed}
            theme="green"
            delay={0.05}
          />
          <StatCard
            icon={Clock}
            label={t('pendingReviews')}
            value={loading ? '…' : stats.pending}
            theme="sunny"
            delay={0.1}
          />
        </div>

        <TeacherStagePanel />

        <div>
          <div className="flex items-center justify-between mb-3 gap-3">
            <h2 className="font-heading font-bold text-lg text-sky-900">{t('myStudents')}</h2>
            {error ? (
              <button type="button" onClick={handleRetry} className="text-sm font-semibold text-sky-600 hover:underline">
                {t('retry')}
              </button>
            ) : null}
          </div>
          {loading ? (
            <p className="text-sky-800/60 text-sm py-10 text-center">{t('loadingStudents')}</p>
          ) : error ? (
            <p className="text-red-600 text-sm py-10 text-center">{error}</p>
          ) : (
            <StudentListing
              students={myStudents}
              basePath="/teacher/students"
              classesAssigned={teacher.classesAssigned || []}
            />
          )}
        </div>
      </div>
    </div>
  )
}
