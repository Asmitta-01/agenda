<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $launchedOn = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $startHour = null;

    #[ORM\Column(nullable: true)]
    private ?\DateInterval $duration = null;

    #[ORM\ManyToOne(inversedBy: 'events')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Agenda $agenda = null;

    #[ORM\ManyToOne(inversedBy: 'events')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getLaunchedOn(): ?\DateTimeInterface
    {
        return $this->launchedOn;
    }

    public function setLaunchedOn(\DateTimeInterface $launchedOn): self
    {
        $this->launchedOn = $launchedOn;

        return $this;
    }

    public function getStartHour(): ?\DateTimeInterface
    {
        return $this->startHour;
    }

    public function setStartHour(\DateTimeInterface $startHour): self
    {
        $this->startHour = $startHour;

        return $this;
    }

    public function getDuration(): ?\DateInterval
    {
        return $this->duration;
    }

    public function setDuration(?\DateInterval $duration): self
    {
        $this->duration = $duration;

        return $this;
    }

    public function getAgenda(): ?Agenda
    {
        return $this->agenda;
    }

    public function setAgenda(?Agenda $agenda): self
    {
        $this->agenda = $agenda;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }

    /**
     * Return the Entity compatible to FullCalendar Js(https://fullcalendar.io/) plugin's event
     * 
     * Each event have one of these:
     * - id
     * - groupId
     * - title [Required]
     * - start [Required]
     * - end
     * - allDay
     * - className
     * All the properties at https://fullcalendar.io/docs/event-source-object
     * 
     * @param bool $onlyFullCalendarProperties If set to true, the function will return only these previous given properties, otherwise it will return all the Event object properties in an array form
     */
    public function toFullCalendarJsArray(bool $onlyFullCalendarProperties = true): array
    {
        if (!$this->title)
            return [];

        switch ($this->category->getName()) {
            case 'Birthday':
                $class = ['text-bg-warning', 'border-warning'];
                break;
            case 'Wedding':
                $class = ['text-bg-success', 'border-success'];
                break;
            case 'Meeting':
                $class = ['text-bg-info', 'border-info'];
                break;
            case 'Conference':
                $class = ['text-bg-primary', 'border-primary'];
                break;
            case 'Other':
                $class = ['text-bg-secondary', 'border-secondary'];
                break;
            default:
                $class = ['text-bg-dark', 'border-dark'];
                break;
        }
        if ($onlyFullCalendarProperties) {
            $start = new \DateTime($this->launchedOn->format('Y-m-d') . ' ' . $this->startHour->format('H:i'));
            $end = $this->duration ? date_add($start, $this->duration) : $start;

            $array = [
                'id' => $this->id,
                'title' => $this->title,
                'start' => $this->launchedOn->format('Y-m-d') . ' ' . $this->startHour->format('H:i'),
                'end' => $end->format('Y-m-d H:i'),
                'allDay' => $this->duration ? false : true,
                'className' => $class
            ];
        } else {
            $array = [
                'id' => $this->id,
                'title' => $this->title,
                'description' => $this->description,
                'launchedOn' => $this->launchedOn->format('D d M Y'),
                'startHour' => $this->startHour->format('H:i'),
                'duration' => $this->duration ? $this->duration->format('%d day(s) %h hour(s)') : null,
                'category' => $this->category->getName(),
                'className' => $class[0]
            ];
        }

        return $array;
    }
}
