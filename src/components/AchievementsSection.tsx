import { useState } from "react"
import { Award, FileText, ChevronDown, ChevronUp, Trophy } from "lucide-react"
import type { IBadge, ICertificate } from "../types/User"

interface AchievementsSectionProps {
    badges: IBadge[]
    certificates: ICertificate[]
    onViewCertificate: (url: string) => void
}

const AchievementsSection = ({ badges, certificates, onViewCertificate }: AchievementsSectionProps) => {
    return (
        <div className="mt-8 backdrop-blur-sm bg-gray-800/40 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Award className="text-yellow-400" />
                Achievements
            </h3>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Badges */}
                <div className="lg:w-2/3">
                    <BadgesSection badges={badges} />
                </div>
                
                {/* Vertical Separator Line */}
                <div className="hidden lg:block relative lg:w-px">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                </div>
                
                {/* Right Column - Certificates */}
                <div className="lg:w-1/3">
                    <CertificatesSection 
                        certificates={certificates}
                        onViewCertificate={onViewCertificate}
                    />
                </div>
            </div>
        </div>
    )
}

const BadgesSection = ({ badges }: { badges: IBadge[] }) => {
    const [showAll, setShowAll] = useState(false)
    const initialVisibleCount = 4 

    if (badges.length === 0) {
        return (
            <div className="text-center py-8">
                <Award size={48} className="mx-auto mb-4 text-gray-700" />
                <p className="text-gray-500">No badges earned yet.</p>
                <p className="text-sm text-gray-600">Start solving questions to earn badges!</p>
            </div>
        )
    }

    const visibleBadges = showAll ? badges : badges.slice(0, initialVisibleCount)
    const hasMoreBadges = badges.length > initialVisibleCount

    // Group badges by language
    const groupedBadges: { [key: string]: IBadge[] } = {}
    visibleBadges.forEach(badge => {
        const langName = (typeof badge.language === 'object' && badge.language?.name) || 'Unknown'
        if (!groupedBadges[langName]) {
            groupedBadges[langName] = []
        }
        groupedBadges[langName].push(badge)
    })

    // Get badge color based on level
    const getBadgeColor = (level: string) => {
        if (!level) return { bg: '#718096', text: '#718096', progress: '#71809666' }
        
        const levelLower = level.toLowerCase()
        
        if (levelLower.includes('bronze')) {
            return { bg: '#CD7F32', text: '#CD7F32', progress: '#CD7F3266' }
        } else if (levelLower.includes('silver')) {
            return { bg: '#C0C0C0', text: '#C0C0C0', progress: '#C0C0C066' }
        } else if (levelLower.includes('gold')) {
            return { bg: '#FFD700', text: '#FFD700', progress: '#FFD70066' }
        } else if (levelLower.includes('platinum')) {
            return { bg: '#E5E4E2', text: '#E5E4E2', progress: '#E5E4E266' }
        }
        
        return { bg: '#718096', text: '#718096', progress: '#71809666' }
    }

    // Get badge percentage based on level 
    const getBadgePercentage = (badge: IBadge): number => {
        // First try to get from badge.percentage
        if (typeof badge.percentage === 'number' && badge.percentage > 0) {
            return badge.percentage
        }
        
        // If not available, infer from level
        const level = badge.level || ''
        const levelLower = level.toLowerCase()
        
        if (levelLower.includes('bronze')) return 20
        if (levelLower.includes('silver')) return 40
        if (levelLower.includes('gold')) return 60
        if (levelLower.includes('platinum')) return 80
        
        return 0
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                    <Trophy className="text-green-400" />
                    Badges
                </h4>
                <span className="text-sm text-gray-400">
                    {badges.length} badge{badges.length !== 1 ? 's' : ''} earned
                </span>
            </div>

            {/* Display badges grouped by language */}
            {Object.entries(groupedBadges).map(([language, langBadges]) => (
                <div key={language} className="mb-6">
                    <h5 className="text-md font-medium text-gray-400 mb-4">{language}</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {langBadges.map((badge, index) => {
                            const colors = getBadgeColor(badge.level || '')
                            const percentage = getBadgePercentage(badge)
                            const badgeLevel = badge.level || 'Unknown'
                            
                            return (
                                <div 
                                    key={badge._id || index} 
                                    className="bg-gray-900/50 border border-gray-700 rounded-xl p-3 text-center hover:border-gray-600 transition-colors group relative"
                                >
                                    {/* Badge icon with color */}
                                    <div className="w-16 h-16 mx-auto mb-2">
                                        <div 
                                            className="absolute inset-0 rounded-full flex items-center justify-center" 
                                            style={{ backgroundColor: colors.progress }}
                                        >
                                            <Award size={28} style={{ color: colors.text }} />
                                        </div>
                                        <div 
                                            className="absolute inset-2 rounded-full flex items-center justify-center text-xs font-bold"
                                            style={{ 
                                                color: colors.text,
                                                backgroundColor: colors.bg + '20'
                                            }}
                                        >
                                            {percentage}%
                                        </div>
                                    </div>
                                    
                                    {/* Badge level */}
                                    <p className="font-medium text-xs mb-1 truncate">{badgeLevel}</p>
                                    
                                    {/* Progress bar */}
                                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{ 
                                                width: `${percentage}%`,
                                                backgroundColor: colors.bg
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Language */}
                                    <p className="text-xs text-gray-500 mt-1 truncate">{language}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            {/* View More/Less button */}
            {hasMoreBadges && (
                <div className="text-center mt-6">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                    >
                        {showAll ? (
                            <>
                                <ChevronUp size={16} />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown size={16} />
                                View All {badges.length} Badges
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}

const CertificatesSection = ({ certificates, onViewCertificate }: { 
    certificates: ICertificate[] 
    onViewCertificate: (url: string) => void 
}) => {
    const [showAllCertificates, setShowAllCertificates] = useState(false)
    const initialVisibleCertificates = 2
    const hasMoreCertificates = certificates.length > initialVisibleCertificates
    
    const visibleCertificates = showAllCertificates 
        ? certificates 
        : certificates.slice(0, initialVisibleCertificates)

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                    <FileText className="text-green-400" />
                    Certificates
                </h4>
                <span className="text-sm text-gray-400">
                    {certificates.length} certificate{certificates.length !== 1 ? 's' : ''}
                </span>
            </div>

            {certificates.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {visibleCertificates.map((cert, index) => (
                            <div 
                                key={cert._id || index} 
                                className="bg-gray-900/50 border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 transition-colors"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                        <FileText className="text-green-400" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">Mastery Certificate</p>
                                        <p className="text-sm text-gray-400">{(typeof cert.language === 'object' && cert.language?.name) || 'Unknown Language'}</p>
                                        {cert.earnedAt && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Earned on {new Date(cert.earnedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full h-fit">
                                        100%
                                    </div>
                                </div>
                                <button
                                    onClick={() => onViewCertificate(cert.url)}
                                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    View Certificate
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    {/* View All Certificates button */}
                    {hasMoreCertificates && (
                        <div className="text-center mt-6">
                            <button
                                onClick={() => setShowAllCertificates(!showAllCertificates)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                            >
                                {showAllCertificates ? (
                                    <>
                                        <ChevronUp size={16} />
                                        Show Less
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={16} />
                                        View All {certificates.length} Certificates
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-8">
                    <FileText size={48} className="mx-auto mb-4 text-gray-700" />
                    <p className="text-gray-500">No certificates earned yet.</p>
                    <p className="text-sm text-gray-600">Complete 100% of any language to earn certificates!</p>
                </div>
            )}
        </div>
    )
}

export default AchievementsSection
