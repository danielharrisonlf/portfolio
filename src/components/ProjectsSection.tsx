import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { TbArrowsMaximize, TbExternalLink } from 'react-icons/tb';
import { ProjectItem } from '../types';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';
import { ProjectImageViewer } from './ProjectImageViewer';
import { TechIcon } from './TechIcon';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [sectionRef, isRevealed] = useIntersectionReveal<HTMLElement>(0.12);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; title: string } | null>(null);

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
      <h2 id="proj-heading" style={{ fontFamily: "'Newsreader', serif", fontWeight: 500, fontSize: '32px', margin: '0 0 32px' }}>
        Projetos
      </h2>
      <div id="projects-grid" className="project-showcase">
        {projects.map((project) => {
          const image = project.image;
          const alt = project.imageAlt ?? `Captura de tela do projeto ${project.name}`;
          const isMobile = project.imageType === 'mobile';

          return (
            <article key={project.id ?? project.name} className="project-case">
              {image ? (
                <button
                  type="button"
                  className={`project-preview ${isMobile ? 'project-preview-mobile' : 'project-preview-web'}`}
                  onClick={() => setSelectedImage({ src: image, alt, title: project.name })}
                  aria-label={`Ampliar captura de ${project.name}`}
                  aria-haspopup="dialog"
                >
                  {isMobile ? (
                    <span className="project-phone">
                      <img src={image} alt={alt} width={project.imageWidth} height={project.imageHeight} loading="lazy" decoding="async" />
                    </span>
                  ) : (
                    <img src={image} alt={alt} width={project.imageWidth} height={project.imageHeight} loading="lazy" decoding="async" />
                  )}
                  <span className="project-preview-action" aria-hidden="true">
                    <TbArrowsMaximize size={16} /> Ampliar imagem
                  </span>
                </button>
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
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ver código de ${project.name} no GitHub`}>
                        <FaGithub size={15} /> Código no GitHub
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Abrir demo de ${project.name}`}>
                        <TbExternalLink size={15} /> Ver demonstração
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {selectedImage && <ProjectImageViewer image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </section>
  );
};
