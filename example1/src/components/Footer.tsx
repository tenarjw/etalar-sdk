"use client";
import * as React from "react";
import styled from "styled-components";

export interface SectionProps {
  maxWidth?: number;
  lazyLoad?: boolean;
}

const Footer: React.FC<SectionProps> = ({ maxWidth = 1200, lazyLoad = false }) => {
  return (
    <Container $maxWidth={maxWidth}>
      <Section>
        <FooterContent>
          <FooterGrid>
            Aplikacja testowa 1
          </FooterGrid>
        </FooterContent>
      </Section>
    </Container>
  );
};

const Container = styled.footer<{ $maxWidth: number }>`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 20px;
  min-height: 100px;
  max-width: ${props => props.$maxWidth}px;
  margin: 0 auto;
`;

const Section = styled.section`
  width: 100%;
`;

const FooterContent = styled.div`
  width: 100%;
  background-color: lightgray;
  min-height: 100px;
  display: flex;
  justify-content: center;
  padding: 7px 48px;
`;

const FooterGrid = styled.div`
  display: flex;
  max-width: 1400px;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 991px) {
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;




export default Footer;
