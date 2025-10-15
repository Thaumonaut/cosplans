# Feature Specification: AI-Generated Reference Poses with Face Swap

**Feature Branch**: `002-ai-references`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: User description: "Add the ability to generate reference poses for a character using ai with the ability to add the models face onto the generated reference."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Character Reference Poses (Priority: P1)

A cosplayer planning a photoshoot needs reference poses for a specific character (e.g., Spiderman in a dynamic action pose) and wants to generate multiple AI reference images to choose from without manually searching the internet or commissioning custom artwork.

**Why this priority**: This is the core functionality that enables cosplayers to quickly visualize poses for their characters, accelerating shoot planning and reducing prep time.

**Independent Test**: Can be fully tested by entering a character name and pose description, generating multiple reference images, and verifying images match the description and can be saved to the shoot, delivering the value of rapid pose ideation.

**Acceptance Scenarios**:

1. **Given** a user is editing a shoot with a character assigned (e.g., "Spiderman"), **When** the user navigates to the reference section and selects "Generate AI Poses" with a description "dynamic web-slinging action pose", **Then** the system generates 3-5 reference pose images showing the character in the requested pose style.

2. **Given** a user has generated reference poses, **When** the user selects one or more generated images, **Then** the system adds the selected images to the shoot's reference gallery with a tag indicating they are AI-generated.

3. **Given** a user requests AI pose generation, **When** the generation fails (service unavailable, timeout, or content policy violation), **Then** the system displays a clear error message and allows the user to retry or modify their request.

---

### User Story 2 - Face Swap onto Generated Poses (Priority: P2)

A cosplayer wants to visualize themselves or their model in the generated character pose by uploading a face photo and having it swapped onto the AI-generated reference, creating a personalized preview of how the final shoot might look.

**Why this priority**: Face swapping adds significant personalization value but the base pose generation must work first to provide the foundation for face swapping.

**Independent Test**: Can be tested independently by generating a reference pose, uploading a face photo, applying face swap, and verifying the resulting image shows the uploaded face on the character body in the requested pose.

**Acceptance Scenarios**:

1. **Given** a user has an AI-generated reference pose, **When** the user selects "Add My Face" and uploads a clear front-facing photo, **Then** the system processes the face swap and displays a preview with the uploaded face applied to the character pose.

2. **Given** a user has uploaded a face photo for face swap, **When** the face detection fails (poor lighting, side angle, multiple faces, obscured features), **Then** the system provides specific feedback on why the face couldn't be detected and guidance on photo requirements.

3. **Given** a user has successfully generated a face-swapped reference, **When** the user saves the image, **Then** the system stores both the original AI pose and the face-swapped version in the reference gallery with clear labels.

---

### User Story 3 - Batch Pose Generation with Variations (Priority: P3)

A cosplayer planning multiple shots needs to generate several pose variations at once (e.g., "5 different action poses for Spiderman") to explore different creative directions without repeating the generation process multiple times.

**Why this priority**: Batch generation improves workflow efficiency but is not essential for the MVP since users can generate poses individually.

**Independent Test**: Can be tested independently by requesting multiple pose variations in a single generation, verifying all variations are generated, and confirming users can review and select their favorites.

**Acceptance Scenarios**:

1. **Given** a user enters a character and selects "Generate Multiple Variations", **When** the user specifies quantity (3-10 poses) and provides a base description, **Then** the system generates the requested number of distinct pose variations.

2. **Given** multiple pose variations are generated, **When** the user reviews them, **Then** the system provides a selection interface allowing the user to favorite, save, or discard individual poses before adding them to the shoot.

---

### User Story 4 - Reference Pose History and Reuse (Priority: P4)

A team member wants to reuse AI-generated reference poses from previous shoots for consistency across a series (e.g., using the same character pose style for multiple shoots in a storyline) without regenerating or manually copying references.

**Why this priority**: This enhances long-term workflow but requires the base generation and storage features to be established first.

**Independent Test**: Can be tested independently by generating poses for one shoot, accessing pose history from another shoot, and importing previous generations into the current shoot.

**Acceptance Scenarios**:

1. **Given** a user has generated AI poses in previous shoots, **When** the user opens the "AI Pose History" panel, **Then** the system displays all previously generated poses organized by shoot and character.

2. **Given** a user views AI pose history, **When** the user selects poses from a previous shoot, **Then** the system copies those references to the current shoot without requiring regeneration.

---

### Edge Cases

- What happens when a user requests a character pose that violates content policies (violence, explicit content, copyrighted characters with strict licensing)?
- How does the system handle face swap when the uploaded photo contains multiple faces or no detectable faces?
- What happens when AI generation takes longer than expected (>30 seconds) - should there be progress indication or timeout?
- How does the system handle mobile uploads for face photos with very large file sizes or unsupported formats?
- What happens when a user tries to generate poses while offline on mobile?
- How does the system handle requests for extremely specific poses that the AI may struggle to generate accurately?
- What happens when a user uploads a copyrighted face (celebrity, public figure) for face swapping?
- How does the system handle storage limits when teams generate hundreds of AI reference poses?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to initiate AI pose generation from the shoot detail page's reference section by providing a character name and pose description (text prompt).

- **FR-002**: System MUST generate 3-5 reference pose variations per generation request, displaying them in a preview gallery before saving.

- **FR-003**: Users MUST be able to select which generated poses to save to their shoot's reference gallery, with options to save all, some, or none.

- **FR-004**: System MUST tag all AI-generated references with metadata indicating they are AI-generated, including generation date, prompt used, and generator version.

- **FR-005**: Users MUST be able to upload a face photo (JPEG, PNG, HEIC formats) to apply face swap to any AI-generated reference pose.

- **FR-006**: System MUST validate uploaded face photos for: single clear face, front-facing orientation, sufficient resolution (minimum 512x512 pixels), and appropriate lighting before attempting face swap.

- **FR-007**: System MUST provide clear error messages when face detection fails, including specific guidance on photo requirements: "Photo must show a single person facing the camera with clear, well-lit features."

- **FR-008**: System MUST store both original AI-generated poses and face-swapped versions separately in the reference gallery, allowing users to access either version.

- **FR-009**: System MUST handle AI generation failures gracefully with user-friendly error messages and retry options, distinguishing between temporary service issues and content policy violations.

- **FR-010**: System MUST provide progress indication during AI generation (expected 10-30 seconds per batch) and face swap processing (expected 5-15 seconds per image).

- **FR-011**: System MUST enforce content policy restrictions prohibiting explicit/adult content and extreme violence in AI-generated reference poses, while allowing most character types including copyrighted characters for personal reference use.

- **FR-012**: System MUST provide user-controlled retention settings for uploaded face photos with default auto-delete after processing and opt-in option to save for reuse, requiring explicit user consent with clear privacy implications explained at upload time.

- **FR-013**: System MUST handle mobile offline scenarios by queueing AI generation requests and processing them when connection is restored, notifying users of pending requests.

- **FR-014**: Users MUST be able to view AI pose generation history showing all previous generations across all shoots they have access to, organized by date and character.

- **FR-015**: Users MUST be able to import previously generated AI poses from any accessible shoot into their current shoot without regenerating.

- **FR-016**: System MUST implement tiered monthly limits on AI pose generations (e.g., Free tier: 10 generations/month, Pro tier: 50 generations/month, Team tier: 200 generations/month) with clear quota tracking UI showing remaining generations and upgrade options when limits are reached.

- **FR-017**: Users MUST be able to view their current generation quota status (remaining/total generations this month) before initiating AI generation, with the quota display prominently shown in the generation interface.

### Key Entities

- **AI Generated Reference**: An AI-created reference image with metadata including character name, pose description (prompt), generation timestamp, model version, and whether it's been face-swapped.

- **Face Swap Version**: A variant of an AI-generated reference with a user's face applied, linked to the original reference and the face photo used for generation.

- **Face Photo**: User-uploaded photo used for face swapping, with validation status, detection quality score, retention preference (auto-delete or saved), and consent timestamp.

- **Generation Request**: Record of an AI generation attempt including user, shoot, prompt, status (pending/completed/failed), and resulting references.

- **Pose History Entry**: Archive of AI-generated references across shoots, allowing users to browse and reuse previous generations without regenerating.

- **Generation Quota**: Tracks monthly AI generation usage per user or team against their subscription tier limit, with reset date and remaining quota count.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can generate a set of 3-5 reference pose variations from prompt to saved images in under 45 seconds (including 30 seconds generation time).

- **SC-002**: 90% of AI pose generation requests produce usable reference images that match the character and pose description provided by the user.

- **SC-003**: Users can successfully complete face swap on reference poses in under 20 seconds when a valid face photo is provided.

- **SC-004**: 85% of uploaded face photos pass validation on first attempt when users follow the photo requirement guidelines.

- **SC-005**: Users can access and reuse previously generated AI poses from pose history in under 10 seconds, reducing redundant generations by 40%.

- **SC-006**: System maintains 99% uptime for AI generation features with graceful degradation and clear error messaging when external AI services are unavailable.

- **SC-007**: Mobile users can successfully generate and save AI reference poses with the same success rate as desktop users (within 5% variance).

## Assumptions

- AI generation is powered by external AI service(s) requiring API integration (service selection is an implementation detail).
- Face swap processing requires face detection and image manipulation capabilities available through AI services.
- Generated reference images are for personal use within the app and users understand AI generation limitations and potential inaccuracies.
- Face photos uploaded for face swapping are of the cosplayer or model with their explicit consent.
- Character names and pose descriptions are provided in English (internationalization is a future enhancement).
- Generated reference images are standard resolution (1024x1024 or similar) suitable for reference viewing on mobile and desktop.
- Users understand that AI-generated references are creative tools and may require iteration to achieve desired results.
- The feature is accessible from the shoot detail page's reference section where users manage all reference materials.
- Mobile uploads for face photos use native camera/gallery access with appropriate permissions.
- Content policy enforcement (prohibiting explicit/adult content and extreme violence) is handled by the AI service provider or through additional filtering mechanisms.
- Face photo retention preferences default to auto-delete for privacy protection, with users explicitly opting in to save photos for reuse.
- Tiered subscription model exists with Free, Pro, and Team tiers having different monthly generation quotas.
- Quota tracking resets monthly and applies per user or per team depending on subscription structure (business model decision).
