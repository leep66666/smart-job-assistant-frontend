import type { ManualResumeFormData, EducationEntry } from '../../types';

type ExperienceSection = 'internships' | 'projects' | 'work' | 'competitions';
type ArraySection = ExperienceSection | 'education';

interface ManualResumeFormProps {
  data: ManualResumeFormData;
  onChange: (updated: ManualResumeFormData) => void;
}

const ManualResumeForm = ({ data, onChange }: ManualResumeFormProps) => {
  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    const entries = data.education.map((entry, idx) =>
      idx === index ? { ...entry, [field]: value } : entry
    );
    onChange({ ...data, education: entries });
  };

  const updateExperience = <K extends ExperienceSection>(
    section: K,
    index: number,
    field: keyof ManualResumeFormData[K][number],
    value: string
  ) => {
    const updated = data[section].map((entry, idx) =>
      idx === index ? { ...entry, [field]: value } : entry
    ) as ManualResumeFormData[K];
    onChange({ ...data, [section]: updated });
  };

  const addEntry = <K extends ExperienceSection>(
    section: K,
    template: ManualResumeFormData[K][number]
  ) => {
    onChange({ ...data, [section]: [...data[section], template] });
  };

  const removeEntry = (section: ArraySection, index: number, minLength = 0) => {
    if (data[section].length <= minLength) return;
    const updated = data[section].filter((_, idx) => idx !== index);
    onChange({ ...data, [section]: updated });
  };

  return (
    <div className="space-y-10">
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information <span className="text-blue-600">*</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={data.personal.fullName}
              onChange={(event) =>
                onChange({ ...data, personal: { ...data.personal, fullName: event.target.value } })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="e.g., Alex Chen"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={data.personal.email}
              onChange={(event) =>
                onChange({ ...data, personal: { ...data.personal, email: event.target.value } })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="alex@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Country Code</label>
            <input
              type="text"
              value={data.personal.phoneCode}
              onChange={(event) =>
                onChange({ ...data, personal: { ...data.personal, phoneCode: event.target.value } })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="+86"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={data.personal.phoneNumber}
              onChange={(event) =>
                onChange({ ...data, personal: { ...data.personal, phoneNumber: event.target.value } })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="13800000000"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Education <span className="text-blue-600">*</span>
            </h3>
            <p className="text-sm text-gray-500">At least one entry is required.</p>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                education: [...data.education, emptyEducation()],
              })
            }
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Add Education
          </button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  Education - {index + 1}
                  {index === 0 && <span className="text-blue-600 ml-1">*</span>}
                </p>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeEntry('education', index, 1)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(event) => updateEducation(index, 'degree', event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Bachelor / Master / PhD"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">School</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(event) => updateEducation(index, 'school', event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="University name"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(event) => updateEducation(index, 'startDate', event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="YYYY/MM/DD"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">End Date</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(event) => updateEducation(index, 'endDate', event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="YYYY/MM/DD"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Major</label>
                  <input
                    type="text"
                    value={edu.major}
                    onChange={(event) => updateEducation(index, 'major', event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Major"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">GPA (score/base)</label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(event) => updateEducation(index, 'gpa', event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Score / Base"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Internships</h3>
          <button
            type="button"
            onClick={() =>
              addEntry('internships', {
                company: '',
                title: '',
                timeframe: '',
                responsibilities: '',
              })
            }
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Add Internship
          </button>
        </div>
        <div className="space-y-4">
          {data.internships.map((internship, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Internship - {index + 1}</p>
                {data.internships.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry('internships', index, 1)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Company</label>
                  <input
                    type="text"
                    value={internship.company}
                    onChange={(event) =>
                      updateExperience('internships', index, 'company', event.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Title</label>
                  <input
                    type="text"
                    value={internship.title}
                    onChange={(event) =>
                      updateExperience('internships', index, 'title', event.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Intern Title"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Internship Period</label>
                  <input
                    type="text"
                    value={internship.timeframe}
                    onChange={(event) =>
                      updateExperience('internships', index, 'timeframe', event.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="YYYY/MM - YYYY/MM"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">Key Responsibilities</label>
                  <textarea
                    value={internship.responsibilities}
                    onChange={(event) =>
                      updateExperience('internships', index, 'responsibilities', event.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Summarize major contributions"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
          <button
            type="button"
            onClick={() =>
              addEntry('work', {
                company: '',
                title: '',
                timeframe: '',
                responsibilities: '',
                departureReason: '',
              })
            }
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Add Work Experience
          </button>
        </div>
        {data.work.length === 0 ? (
          <p className="text-sm text-gray-500">Add professional experience if applicable.</p>
        ) : (
          <div className="space-y-4">
            {data.work.map((work, index) => (
              <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Work - {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeEntry('work', index)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700">Company</label>
                    <input
                      type="text"
                      value={work.company}
                      onChange={(event) => updateExperience('work', index, 'company', event.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Title</label>
                    <input
                      type="text"
                      value={work.title}
                      onChange={(event) => updateExperience('work', index, 'title', event.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Job Title"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Employment Period</label>
                    <input
                      type="text"
                      value={work.timeframe}
                      onChange={(event) =>
                        updateExperience('work', index, 'timeframe', event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="YYYY/MM - YYYY/MM"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-700">Key Responsibilities</label>
                    <textarea
                      value={work.responsibilities}
                      onChange={(event) =>
                        updateExperience('work', index, 'responsibilities', event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      rows={3}
                      placeholder="Summarize achievements and responsibilities"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-700">Reason for Leaving</label>
                    <input
                      type="text"
                      value={work.departureReason}
                      onChange={(event) =>
                        updateExperience('work', index, 'departureReason', event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Reason for leaving"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          <button
            type="button"
            onClick={() =>
              addEntry('projects', {
                name: '',
                timeframe: '',
                description: '',
              })
            }
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Add Project
          </button>
        </div>
        <div className="space-y-4">
          {data.projects.map((project, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Project - {index + 1}</p>
                {data.projects.length > 0 && (
                  <button
                    type="button"
                    onClick={() => removeEntry('projects', index)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Project Name</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(event) => updateExperience('projects', index, 'name', event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Project Alpha"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Project Period</label>
                  <input
                    type="text"
                    value={project.timeframe}
                    onChange={(event) =>
                      updateExperience('projects', index, 'timeframe', event.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="YYYY/MM - YYYY/MM"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">Project Details</label>
                  <textarea
                    value={project.description}
                    onChange={(event) =>
                      updateExperience('projects', index, 'description', event.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Describe your contribution, tools, and quantified impact"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Skills <span className="text-blue-600">*</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">
              Programming Skills <span className="text-blue-600">*</span>
            </label>
            <textarea
              value={data.skills.programming}
              onChange={(event) =>
                onChange({ ...data, skills: { ...data.skills, programming: event.target.value } })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Languages, frameworks, tools"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">
              Office Skills <span className="text-blue-600">*</span>
            </label>
            <textarea
              value={data.skills.office}
              onChange={(event) =>
                onChange({ ...data, skills: { ...data.skills, office: event.target.value } })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Excel, PowerPoint, data visualization..."
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">
              Languages <span className="text-blue-600">*</span>
            </label>
            <textarea
              value={data.skills.languages}
              onChange={(event) =>
                onChange({ ...data, skills: { ...data.skills, languages: event.target.value } })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Mandarin (native), English (IELTS 7.5)..."
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Competitions</h3>
          <button
            type="button"
            onClick={() =>
              addEntry('competitions', {
                name: '',
                level: '',
                result: '',
              })
            }
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Add Competition
          </button>
        </div>
        {data.competitions.length === 0 ? (
          <p className="text-sm text-gray-500">Record awards or contests if relevant.</p>
        ) : (
          <div className="space-y-4">
            {data.competitions.map((competition, index) => (
              <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Competition - {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeEntry('competitions', index)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-700">Name</label>
                    <input
                      type="text"
                      value={competition.name}
                      onChange={(event) =>
                        updateExperience('competitions', index, 'name', event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Competition Name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Level</label>
                    <input
                      type="text"
                      value={competition.level}
                      onChange={(event) =>
                        updateExperience('competitions', index, 'level', event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="National / Global"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Result</label>
                    <input
                      type="text"
                      value={competition.result}
                      onChange={(event) =>
                        updateExperience('competitions', index, 'result', event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Gold Medal / Top 5%"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ManualResumeForm;

const emptyEducation = (): EducationEntry => ({
  degree: '',
  school: '',
  startDate: '',
  endDate: '',
  major: '',
  gpa: '',
});
