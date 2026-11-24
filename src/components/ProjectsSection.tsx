import React, { useRef, useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { TbArrowsMaximize, TbChevronLeft, TbChevronRight, TbExternalLink } from 'react-icons/tb';
import { ProjectItem, ProjectMedia } from '../types';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';
import { ProjectImageViewer, ViewerSlide } from './ProjectImageViewer';
import { TechIcon } from './TechIcon';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

interface GallerySelection {
  title: string;
  images: ViewerSlide[];
  initialIndex: number;
}

function getSlides(project: ProjectItem): ProjectMedia[] {
  if (project.images && project.images.length > 0) return project.images;
  if (project.image) {
    return [
      {
        src: project.image,
        alt: project.imageAlt ?? `Captura de tela do projeto ${project.name}`,
        width: project.imageWidth ?? 1440,
        height: project.imageHeight ?? 960,
      },
    ];
  }
  return [];
}

interface ProjectCardProps {
  project: ProjectItem;
  onOpenViewer: (gallery: GallerySelection) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenViewer }) => {
  const slides = getSlides(project);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const isMobile = project.imageType === 'mobile';
  const hasMultiple = slides.length > 1;
  const activeSlide = slides[activeIndex] ?? slides[0];

  const goPrev = () => setActiveIndex((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % slides.length);

  const handleTouchStart = (event: React.TouchEvent) => {
    if (!hasMultiple) return;
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!hasMultiple || touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX;
    if (typeof endX === 'number') {
      const delta = endX - touchStartX.current;
      if (delta > 40) goPrev();
      else if (delta < -40) goNext();
    }
    touchStartX.current = null;
  };

  return (
    <article className="project-case">
      {activeSlide ? (
        <div
          className="project-media"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className={`project-preview ${isMobile ? 'project-preview-mobile' : 'project-preview-web'}`}
            onClick={() =>
              onOpenViewer({
                title: project.name,
                images: slides.map((s) => ({ src: s.src, alt: s.alt, caption: s.caption })),
                initialIndex: activeIndex,
              })
            }
            aria-label={`Ampliar captura${activeSlide.caption ? ` (${activeSlide.caption})` : ''} de ${project.name}`}
            aria-haspopup="dialog"
          >
            {isMobile ? (
              <span className="project-phone">
                <span className="project-slide-stack">
                  {slides.map((slide, sIdx) => (
                    <img
                      key={slide.src}
                      src={slide.src}
                      alt={sIdx === activeIndex ? slide.alt : ''}
                      aria-hidden={sIdx !== activeIndex || undefined}
                      width={slide.width}
                      height={slide.height}
                      loading="lazy"
                      decoding="async"
                      className={`project-slide-img ${sIdx === activeIndex ? 'is-active' : ''}`}
                    />
                  ))}
                </span>
              </span>
            ) : (
              <span className="project-slide-stack">
                {slides.map((slide, sIdx) => (
                  <img
                    key={slide.src}
                    src={slide.src}
                    alt={sIdx === activeIndex ? slide.alt : ''}
                    aria-hidden={sIdx !== activeIndex || undefined}
                    width={slide.width}
                    height={slide.height}
                    loading="lazy"
                    decoding="async"
                    className={`project-slide-img ${sIdx === activeIndex ? 'is-active' : ''}`}
                  />
                ))}
              </span>
            )}
            <span className="project-preview-action" aria-hidden="true">
              <TbArrowsMaximize size={16} /> Ampliar imagem
            </span>
          </button>

          {hasMultiple && (
            <div className="project-carousel-bar" role="group" aria-label={`Galeria de telas de ${project.name}`}>
              <div className="project-carousel-meta">
                <span className="project-carousel-counter">
                  {String(activeIndex + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
                </span>
                {activeSlide.caption && (
                  <span className="project-carousel-caption">{activeSlide.caption}</span>
                )}
              </div>

              <div className="project-carousel-controls">
                <div className="project-carousel-dots" role="tablist" aria-label={`Selecionar tela de ${project.name}`}>
                  {slides.map((slide, sIdx) => {
                    const isActive = sIdx === activeIndex;
                    return (
                      <button
                        key={slide.src}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Ver tela ${sIdx + 1} de ${slides.length}${slide.caption ? `: ${slide.caption}` : ''}`}
                        className={`project-dot-btn ${isActive ? 'is-active' : ''}`}
                        onClick={() => setActiveIndex(sIdx)}
                      >
                        <span className="project-dot-pill" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>

                <div className="project-carousel-arrows">
                  <button
                    type="button"
                    className="project-arrow-btn"
                    onClick={goPrev}
                    aria-label={`Tela anterior de ${project.name}`}
                  >
                    <TbChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="project-arrow-btn"
                    onClick={goNext}
                    aria-label={`Próxima tela de ${project.name}`}
                  >
                    <TbChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="project-preview-empty" aria-hidden="true">{project.name}</div>
      )}

      <div className="project-case-content">
        <h3>{project.name}</h3>
        <p className="project-case-description">{project.desc}</p>
        <ul className="project-case-stack" aria-label={`Tecnologias de ${project.name}`}>
          {project.stack.split('·').map((tech) => (
            <li key={tech}>
              <TechIcon name={tech.trim()} size={12} />
              <span>{tech.trim()}</span>
            </li>
          ))}
        </ul>
        {(project.repoUrl || project.demoUrl) && (
          <div className="project-case-links">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver código de ${project.name} no GitHub`}
              >
                <FaGithub size={15} /> Código no GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir demo de ${project.name}`}
              >
                <TbExternalLink size={15} /> Ver demonstração
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [sectionRef, isRevealed] = useIntersectionReveal<HTMLElement>(0.12);
  const [selectedGallery, setSelectedGallery] = useState<GallerySelection | null>(null);

  return (
    <section
      id="projetos"
      ref={sectionRef}
      aria-labelledby="proj-heading"
      style={{
        borderTop: '1px solid var(--border)',
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '72px 56px',
        opacity: isRevealed ? 1 : 0,
        transform: `translateY(${isRevealed ? 0 : 24}px)`,
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <h2
        id="proj-heading"
        style={{
          fontFamily: "'Newsreader', serif",
          fontWeight: 500,
          fontSize: '32px',
          margin: '0 0 32px',
        }}
      >
        Projetos
      </h2>
      <div id="projects-grid" className="project-showcase">
        {projects.map((project) => (
          <ProjectCard
            key={project.id ?? project.name}
            project={project}
            onOpenViewer={setSelectedGallery}
          />
        ))}
      </div>
      {selectedGallery && (
        <ProjectImageViewer gallery={selectedGallery} onClose={() => setSelectedGallery(null)} />
      )}
    </section>
  );
};
