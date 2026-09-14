import { useEffect, useMemo, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useActiveSection } from './hooks/useActiveSection';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useScrollProgress } from './hooks/useScrollProgress';
import { Header } from './components/layout/Header';
import { MobileMenu } from './components/layout/MobileMenu';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { EducationSection } from './components/sections/EducationSection';
import { ContactSection } from './components/sections/ContactSection';
import {
  education,
  experiences,
  navItems,
  personalInfo,
  practices,
  projects,
  stackLayers,
} from './data/portfolioData';
import { scrollToSection, setHash } from './utils/scroll';

const HOME_ID = 'inicio';

export function App() {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const progress = useScrollProgress();

  /*
   * O painel mobile é montado só abaixo do breakpoint. Escondê-lo por CSS
   * deixaria o overlay no DOM — recebendo foco e prendendo a rolagem do
   * body. Aqui ele simplesmente não existe.
   */
  const isCompact = useMediaQuery('(max-width: 980px)');

  const sectionIds = useMemo(
    () => [HOME_ID, ...navItems.map((item) => item.id)],
    []
  );
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Ao cruzar o breakpoint para desktop, o painel precisa fechar junto —
  // senão a rolagem do body fica travada sem nada na tela para explicar.
  useEffect(() => {
    if (!isCompact) setMenuOpen(false);
  }, [isCompact]);

  const navigate = (id: string) => {
    setMenuOpen(false);
    setHash(id);
    scrollToSection(id);
  };

  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // O href continua no HTML (funciona sem JS, é copiável, tem preview);
    // o clique é que passa a ser controlado para rolar com o offset certo.
    event.preventDefault();
    navigate(id);
  };

  const handleOpenMenu = () => setMenuOpen(true);

  return (
    <>
      <a href="#conteudo" className="skipLink">
        Pular para o conteúdo
      </a>

      <Header
        activeId={activeId}
        navItems={navItems}
        isDark={isDark}
        isScrolled={isScrolled}
        progress={progress}
        onToggleTheme={toggleTheme}
        onOpenMenu={handleOpenMenu}
        onNavigate={handleNavigate}
        githubUrl={personalInfo.githubUrl}
        linkedinUrl={personalInfo.linkedinUrl}
        cvUrl={personalInfo.cvUrl}
      />

      {isCompact && menuOpen && (
        <MobileMenu
          isOpen
          onClose={() => setMenuOpen(false)}
          navItems={navItems}
          info={personalInfo}
          onNavigate={handleNavigate}
        />
      )}

      {/*
        `tabIndex={-1}` para o link "pular para o conteúdo" mover o foco de
        verdade. Sem ele, o destino do skip link fica a cargo do navegador e
        o Tab seguinte volta para o começo do documento.
      */}
      <main id="conteudo" tabIndex={-1}>
        <Hero info={personalInfo} layers={stackLayers} onNavigate={handleNavigate} />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={projects} />
        <EducationSection education={education} practices={practices} />
        <ContactSection info={personalInfo} />
      </main>

      <Footer info={personalInfo} topId={HOME_ID} />
    </>
  );
}

export default App;
