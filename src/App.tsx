import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Navbar } from './components/Navbar';
import { MobileMenu } from './components/MobileMenu';
import { Hero } from './components/Hero';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingNav } from './components/FloatingNav';
import {
  navItems,
  stackItems,
  practices,
  experiences,
  projects,
  education,
  personalInfo,
} from './data/portfolioData';

export const App: React.FC = () => {
  // O atributo data-theme vive só no <html> (escrito por useTheme).
  // Antes ele era duplicado aqui numa div, e o de dentro vencia a cascata.
  const { toggleTheme, isDark } = useTheme('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div
      className="bg-noise"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--fg)',
        minHeight: '100vh',
        fontFamily: "'Archivo', sans-serif",
        transition: 'background-color 0.2s ease, color 0.2s ease',
        position: 'relative',
      }}
    >
      {/* Top Fixed Scroll Indicator */}
      <ScrollProgressBar />

      {/* Floating Glassmorphic Quick Nav Dock */}
      <FloatingNav navItems={navItems} isMenuOpen={mobileMenuOpen} />

      {/* Top Navigation */}
      <Navbar
        navItems={navItems}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenMobileMenu={toggleMobileMenu}
        githubUrl={personalInfo.githubUrl}
        linkedinUrl={personalInfo.linkedinUrl}
        cvUrl={personalInfo.cvUrl}
      />

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        navItems={navItems}
        githubUrl={personalInfo.githubUrl}
        linkedinUrl={personalInfo.linkedinUrl}
        cvUrl={personalInfo.cvUrl}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero stack={stackItems} practices={practices} isDark={isDark} />

        {/* Experience Section */}
        <ExperienceSection experiences={experiences} />

        {/* Projects Section */}
        <ProjectsSection projects={projects} />

        {/* Education Section */}
        <EducationSection education={education} />

        {/* Contact — é alvo da navegação, então mora dentro do <main> */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default App;
