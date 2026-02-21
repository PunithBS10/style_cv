import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const colors = {
    sidebar: '#2d2d3f',
    sidebarText: '#ffffff',
    sidebarMuted: 'rgba(255,255,255,0.65)',
    accent: '#f5c518',
    headerBg: '#fafafa',
    mainBg: '#ffffff',
    textPrimary: '#1a1a2e',
    textSecondary: '#444466',
    textMuted: '#777799',
    border: '#e8e8f0',
};

const s = StyleSheet.create({
    page: {
        flexDirection: 'row',
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: colors.textPrimary,
        backgroundColor: colors.mainBg,
    },
    borderLeft: {
        width: 8,
        backgroundColor: colors.accent,
    },
    borderRight: {
        width: 8,
        backgroundColor: colors.accent,
    },
    sidebar: {
        width: '34%',
        backgroundColor: colors.sidebar,
        padding: '24px 16px',
        color: colors.sidebarText,
    },
    mainContent: {
        flex: 1,
        padding: '24px 22px',
        backgroundColor: colors.mainBg,
    },

    // Sidebar elements
    photoPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#555570',
        alignSelf: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    sidebarSectionTitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1.5,
        marginBottom: 6,
        marginTop: 14,
        color: colors.sidebarText,
    },
    sidebarDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginBottom: 8,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 5,
        gap: 6,
    },
    contactIcon: {
        fontSize: 8,
        color: colors.accent,
        width: 12,
    },
    contactText: {
        fontSize: 8,
        color: colors.sidebarMuted,
        flex: 1,
    },
    sidebarBody: {
        fontSize: 8,
        color: colors.sidebarMuted,
        lineHeight: 1.5,
        marginBottom: 3,
    },
    skillCategory: {
        marginBottom: 5,
    },
    skillLabel: {
        fontSize: 7.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.sidebarText,
        marginBottom: 1,
    },
    skillValue: {
        fontSize: 7.5,
        color: colors.sidebarMuted,
        lineHeight: 1.4,
    },
    hobbyItem: {
        fontSize: 7.5,
        color: colors.sidebarMuted,
        marginBottom: 3,
        lineHeight: 1.4,
    },

    // Main content elements
    nameBlock: {
        marginBottom: 4,
    },
    fullName: {
        fontSize: 22,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 2,
        color: colors.textPrimary,
    },
    jobTitle: {
        fontSize: 9.5,
        letterSpacing: 3,
        color: colors.textSecondary,
        fontWeight: 400,
        marginTop: 2,
    },
    accentLine: {
        height: 3,
        backgroundColor: colors.accent,
        marginTop: 8,
        marginBottom: 16,
        width: 60,
    },
    mainSectionTitle: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1,
        color: colors.textPrimary,
        marginBottom: 8,
        marginTop: 14,
    },
    summary: {
        fontSize: 8.5,
        color: colors.textSecondary,
        lineHeight: 1.6,
        textAlign: 'justify',
        marginBottom: 4,
    },
    expBlock: {
        marginBottom: 10,
    },
    expTitle: {
        fontSize: 9.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.textPrimary,
    },
    expCompany: {
        fontSize: 8,
        color: colors.textMuted,
        marginBottom: 4,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 3,
        paddingLeft: 2,
    },
    bulletDot: {
        fontSize: 8,
        marginRight: 5,
        color: colors.textSecondary,
        marginTop: 0.5,
    },
    bulletText: {
        fontSize: 8,
        color: colors.textSecondary,
        lineHeight: 1.5,
        flex: 1,
    },
    certItem: {
        flexDirection: 'row',
        marginBottom: 3,
        paddingLeft: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 6,
        color: colors.textMuted,
    },
});

export default function ExecutiveTemplate({ data }) {
    const d = data || {};
    const p = d.personalInfo || {};
    const exp = (d.experience || []).filter(e => e.jobTitle || e.company);
    const edu = (d.education || []).filter(e => e.degree || e.institution);
    const skills = d.skills || {};
    const certs = (d.certifications || []).filter(c => c && c.trim());
    const hobbies = (d.hobbies || []).filter(h => h && h.trim());

    const hasSkills = skills.languages || skills.frameworks || skills.devops || skills.databases || skills.other;

    return (
        <Document>
            <Page size="A4" style={s.page}>
                {/* Left yellow border */}
                <View style={s.borderLeft} />

                {/* Sidebar */}
                <View style={s.sidebar}>
                    <View style={s.photoPlaceholder} />

                    {/* Contact */}
                    <Text style={s.sidebarSectionTitle}>CONTACT</Text>
                    <View style={s.sidebarDivider} />
                    {p.email && (
                        <View style={s.contactItem}>
                            <Text style={s.contactIcon}>@</Text>
                            <Text style={s.contactText}>{p.email}</Text>
                        </View>
                    )}
                    {p.phone && (
                        <View style={s.contactItem}>
                            <Text style={s.contactIcon}>#</Text>
                            <Text style={s.contactText}>{p.phone}</Text>
                        </View>
                    )}
                    {p.location && (
                        <View style={s.contactItem}>
                            <Text style={s.contactIcon}>{'>'}</Text>
                            <Text style={s.contactText}>{p.location}</Text>
                        </View>
                    )}
                    {(p.linkedin || p.github || p.portfolio) && (
                        <View style={s.contactItem}>
                            <Text style={s.contactIcon}>~</Text>
                            <Text style={s.contactText}>
                                {[p.linkedin, p.github, p.portfolio].filter(Boolean).join(' | ')}
                            </Text>
                        </View>
                    )}

                    {/* Education */}
                    {edu.length > 0 && (
                        <>
                            <Text style={s.sidebarSectionTitle}>EDUCATION</Text>
                            <View style={s.sidebarDivider} />
                            {edu.map((e, i) => (
                                <View key={i} style={{ marginBottom: 6 }}>
                                    <Text style={[s.sidebarBody, { fontWeight: 700, color: '#fff' }]}>{e.degree}</Text>
                                    <Text style={s.sidebarBody}>{e.institution}{e.graduationDate ? ` (${e.graduationDate})` : ''}</Text>
                                    {e.gpa && <Text style={s.sidebarBody}>GPA: {e.gpa}</Text>}
                                </View>
                            ))}
                        </>
                    )}

                    {/* Skills */}
                    {hasSkills && (
                        <>
                            <Text style={s.sidebarSectionTitle}>KEY SKILLS</Text>
                            <View style={s.sidebarDivider} />
                            {skills.languages && (
                                <View style={s.skillCategory}>
                                    <Text style={s.skillLabel}>Languages:</Text>
                                    <Text style={s.skillValue}>{skills.languages}</Text>
                                </View>
                            )}
                            {skills.frameworks && (
                                <View style={s.skillCategory}>
                                    <Text style={s.skillLabel}>Frameworks/Tools:</Text>
                                    <Text style={s.skillValue}>{skills.frameworks}</Text>
                                </View>
                            )}
                            {skills.devops && (
                                <View style={s.skillCategory}>
                                    <Text style={s.skillLabel}>DevOps:</Text>
                                    <Text style={s.skillValue}>{skills.devops}</Text>
                                </View>
                            )}
                            {skills.databases && (
                                <View style={s.skillCategory}>
                                    <Text style={s.skillLabel}>Database:</Text>
                                    <Text style={s.skillValue}>{skills.databases}</Text>
                                </View>
                            )}
                            {skills.other && (
                                <View style={s.skillCategory}>
                                    <Text style={s.skillLabel}>Other:</Text>
                                    <Text style={s.skillValue}>{skills.other}</Text>
                                </View>
                            )}
                        </>
                    )}

                    {/* Hobbies */}
                    {hobbies.length > 0 && (
                        <>
                            <Text style={s.sidebarSectionTitle}>HOBBIES</Text>
                            <View style={s.sidebarDivider} />
                            {hobbies.map((h, i) => (
                                <View key={i} style={s.bulletItem}>
                                    <Text style={[s.bulletDot, { color: colors.accent }]}>•</Text>
                                    <Text style={s.hobbyItem}>{h}</Text>
                                </View>
                            ))}
                        </>
                    )}
                </View>

                {/* Main Content */}
                <View style={s.mainContent}>
                    <View style={s.nameBlock}>
                        <Text style={s.fullName}>{(p.fullName || 'YOUR NAME').toUpperCase()}</Text>
                        <Text style={s.jobTitle}>{(p.title || 'PROFESSIONAL TITLE').toUpperCase()}</Text>
                    </View>
                    <View style={s.accentLine} />

                    {/* Summary */}
                    {p.summary && (
                        <>
                            <Text style={s.mainSectionTitle}>PROFESSIONAL SUMMARY</Text>
                            <Text style={s.summary}>{p.summary}</Text>
                        </>
                    )}

                    {/* Experience */}
                    {exp.length > 0 && (
                        <>
                            <Text style={s.mainSectionTitle}>PROFESSIONAL EXPERIENCE</Text>
                            {exp.map((e, i) => (
                                <View key={i} style={s.expBlock}>
                                    <Text style={s.expTitle}>{e.jobTitle}</Text>
                                    <Text style={s.expCompany}>
                                        {e.company}{e.startDate ? ` (${e.startDate}` : ''}{e.endDate ? ` – ${e.endDate})` : e.startDate ? ')' : ''}
                                    </Text>
                                    {(e.bullets || []).filter(b => b && b.trim()).map((b, bi) => (
                                        <View key={bi} style={s.bulletItem}>
                                            <Text style={s.bulletDot}>•</Text>
                                            <Text style={s.bulletText}>{b}</Text>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </>
                    )}

                    {/* Certifications */}
                    {certs.length > 0 && (
                        <>
                            <Text style={s.mainSectionTitle}>ACHIEVEMENTS & CERTIFICATIONS</Text>
                            {certs.map((c, i) => (
                                <View key={i} style={s.certItem}>
                                    <Text style={s.bulletDot}>•</Text>
                                    <Text style={s.bulletText}>{c}</Text>
                                </View>
                            ))}
                        </>
                    )}
                </View>

                {/* Right yellow border */}
                <View style={s.borderRight} />
            </Page>
        </Document>
    );
}
