import React from "react";
import styled from "styled-components";
import PersonalInfoTable from "./tables/PersonalInfoTable";
import DiagnosticsTable from "./tables/DiagnosticsTable";
import BackgroundTable from "./tables/BackgroundTable";
import SchoolSupportTable from "./tables/SchoolSupportTable";
import ProgramsTable from "./tables/ProgramsTable";
import SubjectsTable from "./tables/SubjectsTable";
import TeamTableVertical from "./tables/TeamTableVertical";
import EducationPlanTable from "./tables/EducationPlanTable";
import SummaryTable from "./tables/SummaryTable";

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: Arial, sans-serif;
  direction: rtl;
`;

const Header = styled.h1`
  text-align: center;
  color: #0a3b66;
  margin-bottom: 2rem;
`;

const StudentInitialPage = () => (
  <PageWrapper>
    <Header>תוכנית חינוכית - דניאל בר</Header>
    <PersonalInfoTable />
    <DiagnosticsTable />
    <BackgroundTable />
    <SchoolSupportTable />
    <ProgramsTable />
    <SubjectsTable />
    <TeamTableVertical />
    <EducationPlanTable />
    <SummaryTable />
  </PageWrapper>
);

export default StudentInitialPage;
