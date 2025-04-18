import Observations from "./Observations";
import Immunizations from "./Immunizations";
import MedicationRequests from "./MedicationRequests";
import Conditions from "./Conditions";
import AllergyIntollerances from "./AllergyIntollerances";
import DocumentReferences from "./DocumentReferences";
import Procedures from "./Procedures";
import Appointments from "./Appointments";
import CarePlans from "./CarePlans";
import DiagnosticReports from "./DiagnosticReports";
import { useProfile } from "../contexts/ProfileContext";

interface IProps {
  section: fhir4.CompositionSection;
}

export default function CompositionSection({ section }: IProps) {
  const { profile } = useProfile();

  const segregateSectionEntries = (section: fhir4.CompositionSection) => {
    const entries = section.entry?.reduce((acc, entry) => {
      const resource = profile?.getResource(entry.reference)?.resourceType;

      console.log(resource, entry);

      if (resource) {
        acc[resource] = acc[resource] ?? [];
        acc[resource].push(entry);
      }
      return acc;
    }, {} as { [key: string]: fhir4.Reference[] });
    return entries;
  };

  const entries = segregateSectionEntries(section);

  return (
    <div className="mt-6 rounded-sm shadow-sm p-4 pl-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {section.title}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {section.code?.coding?.[0].display ??
              section.code?.coding?.[0].code}
          </p>
        </div>
      </div>
      <Observations references={entries?.Observation ?? []} />
      <Immunizations references={entries?.Immunization ?? []} />
      <MedicationRequests references={entries?.MedicationRequest ?? []} />
      <Conditions references={entries?.Condition ?? []} />
      <AllergyIntollerances references={entries?.AllergyIntolerance ?? []} />
      <DocumentReferences references={entries?.DocumentReference ?? []} />
      <Procedures references={entries?.Procedure ?? []} />
      <Appointments references={entries?.Appointment ?? []} />
      <CarePlans references={entries?.CarePlan ?? []} />
      <DiagnosticReports references={entries?.DiagnosticReport ?? []} />
    </div>
  );
}
