import React from 'react';
import { Layers } from 'lucide-react';

export const ServiceSpecs = ({ serviceDetails }) => {
  if (!serviceDetails?.selectedServices || serviceDetails.selectedServices.length === 0) return null;

  return (
    <div className="pane-content-card animate-fade-in">
      <h3>
        <Layers size={18} /> Service Specifications
      </h3>
      <div className="service-details-display-list">
        {serviceDetails.selectedServices.includes('BIM') && serviceDetails.bimDetails && (
          <div className="service-spec-item">
            <span className="spec-service-title">BIM &amp; 2D Drafting</span>
            <div className="spec-details-grid">
              {serviceDetails.bimDetails.softwareStack && serviceDetails.bimDetails.softwareStack.length > 0 && (
                <div className="spec-detail-row">
                  <span className="spec-label">Software:</span>
                  <div className="spec-chips">
                    {serviceDetails.bimDetails.softwareStack.map((sw, idx) => (
                      <span key={idx} className="spec-chip">{sw}</span>
                    ))}
                  </div>
                </div>
              )}
              {serviceDetails.bimDetails.maxLod && (
                <div className="spec-detail-row">
                  <span className="spec-label">Max LOD:</span>
                  <span className="spec-val">{serviceDetails.bimDetails.maxLod}</span>
                </div>
              )}
              {serviceDetails.bimDetails.cdeExperience && (
                <div className="spec-detail-row">
                  <span className="spec-label">CDE Experience:</span>
                  <span className="spec-val">{serviceDetails.bimDetails.cdeExperience}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {serviceDetails.selectedServices.includes('Audit') && serviceDetails.auditDetails && (
          <div className="service-spec-item">
            <span className="spec-service-title">As-Built Audit</span>
            <div className="spec-details-grid">
              {serviceDetails.auditDetails.equipmentOwned && (
                <div className="spec-detail-row">
                  <span className="spec-label">Equipment:</span>
                  <span className="spec-val">{serviceDetails.auditDetails.equipmentOwned}</span>
                </div>
              )}
              {serviceDetails.auditDetails.serviceRadius && (
                <div className="spec-detail-row">
                  <span className="spec-label">Service Radius:</span>
                  <span className="spec-val">{serviceDetails.auditDetails.serviceRadius}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {serviceDetails.selectedServices.includes('Peer') && serviceDetails.peerReviewDetails && (
          <div className="service-spec-item">
            <span className="spec-service-title">Peer Review</span>
            <div className="spec-details-grid">
              {serviceDetails.peerReviewDetails.teamExperience && (
                <div className="spec-detail-row">
                  <span className="spec-label">Experience:</span>
                  <span className="spec-val">{serviceDetails.peerReviewDetails.teamExperience} Years</span>
                </div>
              )}
              {serviceDetails.peerReviewDetails.specialisation && (
                <div className="spec-detail-row">
                  <span className="spec-label">Specialisation:</span>
                  <span className="spec-val">{serviceDetails.peerReviewDetails.specialisation}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {serviceDetails.selectedServices.includes('BOQ') && serviceDetails.boqDetails && (
          <div className="service-spec-item">
            <span className="spec-service-title">BOQ Creation</span>
            <div className="spec-details-grid">
              {serviceDetails.boqDetails.measurementStandards && (
                <div className="spec-detail-row">
                  <span className="spec-label">Standards:</span>
                  <span className="spec-val">{serviceDetails.boqDetails.measurementStandards}</span>
                </div>
              )}
              {serviceDetails.boqDetails.estimationSoftware && (
                <div className="spec-detail-row">
                  <span className="spec-label">Software:</span>
                  <span className="spec-val">{serviceDetails.boqDetails.estimationSoftware}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {serviceDetails.selectedServices.includes('Viz') && serviceDetails.vizDetails && (
          <div className="service-spec-item">
            <span className="spec-service-title">3D Visualisation</span>
            <div className="spec-details-grid">
              {serviceDetails.vizDetails.renderingEngines && (
                <div className="spec-detail-row">
                  <span className="spec-label">Rendering Engine:</span>
                  <span className="spec-val">{serviceDetails.vizDetails.renderingEngines}</span>
                </div>
              )}
              {serviceDetails.vizDetails.hardwareCapacity && (
                <div className="spec-detail-row">
                  <span className="spec-label">Hardware:</span>
                  <span className="spec-val">{serviceDetails.vizDetails.hardwareCapacity}</span>
                </div>
              )}
              {serviceDetails.vizDetails.animationCapability && (
                <div className="spec-detail-row">
                  <span className="spec-label">Animation:</span>
                  <span className="spec-val">{serviceDetails.vizDetails.animationCapability}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
