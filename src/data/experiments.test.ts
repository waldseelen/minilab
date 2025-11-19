import { getExperiment, getExperiments } from './experiments';

describe('Experiment Data', () => {
  it("should default ageGroup to 'All' when not provided", () => {
    const experiment = getExperiment('en', 5);
    expect(experiment?.ageGroup).toBe('All');
  });

  it("should return the correct ageGroup when it is provided", () => {
    const experiment = getExperiment('en', 1);
    expect(experiment?.ageGroup).toBe('6-8');
  });

  it("should default ageGroup to 'All' for all experiments when not provided", () => {
    const experiments = getExperiments('en');
    const experiment = experiments.find(e => e.id === 5);
    expect(experiment?.ageGroup).toBe('All');
  });
});
